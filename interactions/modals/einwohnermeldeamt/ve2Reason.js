/**
 * @file Modal interaction: ve2Reason
 * @since 1.0.0
*/
const prev = require('../../buttons/einwohnermeldeamt/declineuser.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { ref, get, getDatabase } = require('firebase/database')
module.exports = {
  id: 've2Reason',
  /**
      * @description Executes when the modal with ID ve2Reason is called.

      * @param {Object} interaction The Interaction Object of the command.
      */
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    const empfangslog = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/eLog'))).slice(1).slice(0, -1))
    const ve2log = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/ve2Log'))).slice(1).slice(0, -1))
    const role = interaction.member.guild.roles.cache.find(
      (role) => role.name === 'Verifizierungsebene 2'
    )
    const target = prev.prev.target
    target.roles.add(role)
    empfangslog.send({
      content: `${interaction.user.tag} hat ${target.user} die Rolle \`Verifizierungsebene 2\` hinzugefügt`
    })
    ve2log.send({
      content: target.toString() + '\n\n' + interaction.fields.getTextInputValue('reason'),
      embeds: [prev.prev.embed]
    })
    module.exports.prev = target
    const check = JSON.stringify(await get(ref(db, interaction.member.guild.id + '/einwohnermeldeamt/config/VE2MsgEnabled'))).slice(1).slice(0, -1)
    const serverIcon = interaction.guild.iconURL()
    const ve2MsgEmbed = new EmbedBuilder()
      .setTitle('QueerCity Verifizierung')
      .setThumbnail(serverIcon)
      .setDescription(JSON.stringify(await get(ref(db, interaction.member.guild.id + '/einwohnermeldeamt/config/VE2Msg'))).slice(1).slice(0, -1).replaceAll('\\n', '\n') + '\n**Grund:**\n' + interaction.fields.getTextInputValue('reason'))
      .setFooter({ text: 'QueerCity Verifizierungssystem', iconURL: serverIcon })
    if (check === 'true') {
      try {
        await target.user.send({
          content: JSON.stringify(await get(ref(db, interaction.member.guild.id + '/einwohnermeldeamt/config/VE2Msg'))).slice(1).slice(0, -1) + '\n**Grund:**\n' + interaction.fields.getTextInputValue('ve2Grund'),
          embeds: [ve2MsgEmbed]
        })
        interaction.reply({
          content: '`Verifizierungsebene 2` hinzugefügt',
          ephemeral: true
        })
      } catch (e) {
        interaction.reply({
          content: '`Verifizierungsebene 2` hinzugefügt\nUser akzeptiert keine Nachricht',
          ephemeral: true
        })
      }
    } else if (check === 'optional') {
      const optionalRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('sendoptionalve2')
            .setLabel('Senden')
            .setStyle(ButtonStyle.Primary)
        )
      interaction.reply({
        content: `${'Verifizierungsebene 2'} hinzugefügt\n\n**Möchtest du die VE2-Nachricht an den User senden?**`,
        components: [optionalRow],
        embeds: [ve2MsgEmbed],
        ephemeral: true,
        attachments: []
      })
    } else {
      interaction.reply({
        content: '`Verifizierungsebene 2` hinzugefügt',
        ephemeral: true
      })
    }
    const embed = await prev.prev.interaction.message.embeds[0]
    const newmsg = (interaction.message.content) + '\nVE2 durch: ' + String(interaction.user)
    embed.data.color = 15158332
    try {
      await prev.prev.interaction.message.edit({ components: [], embeds: [embed] })
      await interaction.message.edit(newmsg)
    } catch {
      return null
    }
  }
}
