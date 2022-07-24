/* eslint-disable no-tabs */
/**
 * @file Usertools Select-Menu interaction
 * @since 1.0.0
*/

const {
  EmbedBuilder
} = require('discord.js')

const imp = require('../../context-menus/user/empfangtools')
const { ref, get, getDatabase, onValue } = require('firebase/database')
module.exports = {
  id: 'empfangselect',

  /**
   * @description Executes when a select menu option with ID "empfangselectmenu" is clicked.

   * @param {Object} interaction The Interaction Object of the command.
   */

  async execute (interaction) {
    const db = getDatabase()
    const target = imp.prev.interaction.targetMember
    const prev = imp.prev.interaction
    prev.editReply({
      components: [imp.prev.roleRow]
    })
    const id = interaction.guild.id
    function edit () {
      const roles = ref(db, id + '/einwohnermeldeamt/config/roles')
      let rolesList = []
      const unsubRoles = onValue(roles, async (snapshot) => {
        const roles = snapshot.val()
        try {
          for (let i = 0; i < Object.keys(roles).length; i++) {
            const role = ref(
              db,
              id + '/einwohnermeldeamt/config/roles/' + Object.keys(roles)[i]
            )
            const unsubRole = onValue(role, async (snapshot) => {
              const r = interaction.guild.roles.cache.get(Object.values(snapshot.val())[0])
              rolesList.push(r)
            })
            unsubRole()
          }
          const addthis = []
          for (let i = 0; i < rolesList.length; i++) {
            if (target.roles.cache.has(rolesList[i].id)) {
              addthis.push(rolesList[i].name)
            }
          }
          imp.prev.interaction.editReply({
            content: `**${target.user.tag}** hat folgende Rollen: \n\`${addthis.join(
              ' | '
            )}\`\n\nWähle eine Rolle aus um sie zu ändern:`,
            components: [imp.prev.roleRow],
            ephemeral: true
          })
          unsubRoles()
        } catch (e) {
          console.log(e)
        }
      })
    }
    const role = interaction.guild.roles.cache.get(interaction.values[0])
    const eLog = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/eLog'))).slice(1).slice(0, -1))
    if (!target.roles.cache.has(role.id)) {
      try {
        await target.roles.add(role)
        interaction.reply({
          content: `${target.user.username} hat die Rolle ${role.name} erhalten.`,
          ephemeral: true
        })
        const logEmbed = new EmbedBuilder()
          .setTitle('Role changed')
          .setAuthor({
            name: target.user.username,
            iconURL: target.user.avatarURL()
          })
          .setDescription(`${target.user} hat die Rolle ${role.name} von ${interaction.user} erhalten.`)
          .setFooter({
            text: interaction.user.tag,
            iconURL: interaction.user.avatarURL()
          });
        edit()
        try {
          eLog.send({ embed: logEmbed })
        } catch (e) {
          return null
        }
      } catch (e) {
        interaction.reply({
          content: 'Missing permission',
          ephemeral: true })
      }
    } else {
      try {
        await target.roles.remove(role)
        interaction.reply({
          content: `${target.user.username} wurde die Rolle ${role.name} entzogen.`,
          ephemeral: true
        })
        const logEmbed = new EmbedBuilder()
          .setTitle('Role changed')
          .setAuthor({
            name: target.user.username,
            iconURL: target.user.avatarURL()
          })
          .setDescription(`${target.user} hat die Rolle ${role.name} von ${interaction.user} erhalten.`)
          .setFooter({
            text: interaction.user.tag,
            iconURL: interaction.user.avatarURL()
          });
        edit()
        try {
          eLog.send({ embed: logEmbed })
        } catch (e) {
          return null
        }
      } catch (e) {
        interaction.reply({
          content: 'Missing permission',
          ephemeral: true })
      }
    }
  }
}
