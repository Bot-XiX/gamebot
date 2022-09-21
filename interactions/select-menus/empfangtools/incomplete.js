const prev = require('../../buttons/einwohnermeldeamt/incomplete.js')
const { ref, get, getDatabase } = require('firebase/database')
const { EmbedBuilder, ActionRowBuilder } = require('discord.js')

/**
 * @file Select menu interaction: incomplete

 * @since 1.0.0
*/
module.exports = {
  id: 'incompleteReason',
  /**
* @description Executes when the select menu with ID incomplete is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    interaction.deferReply({ ephemeral: true })
    const newRow = await new ActionRowBuilder().addComponents(prev.prev.interaction.message.components[0].components[3])
    await prev.prev.interaction.message.edit({ components: [] })
    const db = getDatabase()
    const id = interaction.guild.id
    const empfangslog = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/eLog'))).slice(1).slice(0, -1))
    const target = prev.prev.target
    // Sends a message about the action to the log
    empfangslog.send({
      content: `${interaction.user.tag} hat die Vorstellung von ${target.user} als unvollständig markiert`
    })
    module.exports.prev = target
    const serverIcon = interaction.guild.iconURL()
    const valuelist = []
    for (let i = 0; i < interaction.values.length; i++) {
      switch (interaction.values[i]) {
        case 'name':
          valuelist.push('Name')
          break
        case 'age':
          valuelist.push('Alter')
          break
        case 'place':
          valuelist.push('Wohnort')
          break
        case 'sexuality':
          valuelist.push('Sexualität')
          break
        case 'gender':
          valuelist.push('Geschlecht/Pronomen')
          break
        case 'hobbies':
          valuelist.push('Hobbies')
          break
      }
    }
    console.log('1')
    prev.prev.interaction.editReply({
      content: `Deine Auswahl (${valuelist}) wurde gespeichert.`,
      components: []
    })
    console.log('2')
    const incompleteMsgEmbed = new EmbedBuilder()
      .setTitle('QueerCity Verifizierung')
      .setThumbnail(serverIcon)
      .setDescription(JSON.stringify(await get(ref(db, interaction.member.guild.id + '/einwohnermeldeamt/config/incompleteMsg'))).slice(1).slice(0, -1).replaceAll('\\n', '\n') + '\n**Folgende Angaben fehlten oder waren falsch:**\n' + valuelist.toString().replaceAll(',', '\n'))
      .setFooter({ text: 'QueerCity Verifizierungssystem', iconURL: serverIcon })
    const newmsg = (prev.prev.interaction.message.content) + '\nUnvollständig markiert durch: ' + String(interaction.user)
    console.log('3')
    const embed = prev.prev.embed
    console.log('4')
    embed.data.color = 15158332
    console.log('5')
    try {
      await target.user.send({
        embeds: [incompleteMsgEmbed]
      })
      console.log('6')
      interaction.editReply({
        content: 'Vorstellung als unvollständig markiert.',
        ephemeral: true
      })
      console.log('7')
      try {
        await prev.prev.interaction.message.edit({
          content: newmsg,
          components: [],
          embeds: [embed]
        })
        console.log('8')
      } catch {
        return null
      }
    } catch (e) {
      interaction.editReply({
        content: 'User akzeptiert keine Nachrichten.\nSetze den User stattdessen in VE2',
        ephemeral: true
      })
      prev.prev.interaction.message.edit({
        content: newmsg + '\n*User akzeptiert keine Nachrichten.*',
        components: [newRow],
        embeds: [embed]
      })
    }
  }
}
