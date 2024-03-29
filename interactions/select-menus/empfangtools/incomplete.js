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
    await interaction.deferReply({ ephemeral: true })
    const newRow = new ActionRowBuilder().addComponents(interaction.message.components[0].components[3])
    const db = getDatabase()
    const id = interaction.guild.id
    const empfangslog = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/eLog'))).slice(1).slice(0, -1))
    const target = interaction.guild.members.cache.get(interaction.message.content.split(' ')[1].slice(2, -1))
    // Sends a message about the action to the log
    empfangslog.send({
      content: `${interaction.user.tag} hat die Vorstellung von ${target.user} als unvollständig markiert`
    })
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
    const incompleteMsgEmbed = new EmbedBuilder()
      .setTitle('QueerCity Verifizierung')
      .setThumbnail(serverIcon)
      .setDescription(JSON.stringify(await get(ref(db, interaction.member.guild.id + '/einwohnermeldeamt/config/incompleteMsg'))).slice(1).slice(0, -1).replaceAll('\\n', '\n') + '\n**Folgende Angaben fehlten oder waren falsch:**\n' + valuelist.toString().replaceAll(',', '\n'))
      .setFooter({ text: 'QueerCity Verifizierungssystem', iconURL: serverIcon })
    const reference = await interaction.channel.messages.fetch(interaction.message.reference.messageId)
    const newmsg = (reference.content) + '\nUnvollständig markiert durch: ' + String(interaction.user)
    const embed = reference.embeds[0]
    embed.data.color = 15158332
    try {
      await target.user.send({
        embeds: [incompleteMsgEmbed]
      })
      interaction.editReply({
        content: 'Vorstellung als unvollständig markiert.',
        ephemeral: true
      })

      try {
        await reference.edit({
          content: newmsg,
          components: [],
          embeds: [embed]
        })
      } catch {
        return null
      }
    } catch (e) {
      interaction.editReply({
        content: 'User akzeptiert keine Nachrichten.\nSetze den User stattdessen in VE2',
        ephemeral: true
      })
      reference.edit({
        content: newmsg + '\n*User akzeptiert keine Nachrichten.*',
        components: [newRow],
        embeds: [embed]
      })
    }
  }
}
