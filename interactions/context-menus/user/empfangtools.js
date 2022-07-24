/**
 * @file User menu interaction: Einwohnermeldeamt
 * @since 1.0.0
*/
const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const { ref, get, getDatabase, onValue } = require('firebase/database')
module.exports = {
  data: {
    name: 'Einwohnermeldeamt',
    type: 2 // 2 is for user context menus
  },

  /**
   * @description Executes when the context option with name "Einwohnermeldeamt" is clicked.

   * @param {Object} interaction The Interaction Object of the command.
   */

  async execute (interaction) {
    if (JSON.stringify(await get(ref(getDatabase(), interaction.guild.id + '/einwohnermeldeamt/config/enabled'))).slice(1).slice(0, -1) === 'true') {
      await interaction.deferReply({ ephemeral: true })
      const target = interaction.targetMember
      let roleList = []
      let rolesList = []
      const db = getDatabase()
      const id = interaction.guild.id
      const roles = ref(db, id + '/einwohnermeldeamt/config/roles')
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
              roleList.push(new Object({
                label: r.name,
                value: r.id
              }))
            })
            unsubRole()
          }
          unsubRoles()
          let roleRow = new ActionRowBuilder().addComponents(
            new SelectMenuBuilder()
              .setCustomId('empfangselect')
              .setPlaceholder('Nothing selected')
              .setOptions(roleList)
          )
          const addthis = []
          for (let i = 0; i < rolesList.length; i++) {
            if (target.roles.cache.has(rolesList[i].id)) {
              addthis.push(rolesList[i].name)
            }
          }
          interaction.editReply({
            content: `**${target.user.tag}** hat folgende Rollen: \n\`${addthis.join(
              ' | '
            )}\`\n\nWähle eine Rolle aus um sie zu ändern:`,
            components: [roleRow],
            ephemeral: true
          })
          module.exports.prev = { interaction, roleRow }
        } catch (e) {
          return null
        }
      })
    } else {
      interaction.reply({
        content: 'Dieser Befehl ist deaktiviert',
        ephemeral: true
      })
    }
  }
}
