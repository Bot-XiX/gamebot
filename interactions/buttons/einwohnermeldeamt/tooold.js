const { get, ref, getDatabase } = require('firebase/database')
const { EmbedBuilder } = require('discord.js')
/**
 * @file Button interaction: label

 * @since 1.0.0
*/
module.exports = {
  id: 'tooold',
  /**
  * @description Executes when the button with ID tooold is called.

  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    // This command 1) Bans the User 2) Sends a message to the log channel 3) Sends a message to the user
    await interaction.reply({ content: 'User aufgrund zu hohen Alters gebannt.', ephemeral: true })
    const db = getDatabase()
    const id = interaction.guild.id
    const target = interaction.guild.members.cache.get(interaction.message.content.split('\n')[0].slice(8).slice(0, -1))
    const empfangslog = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/eLog'))).slice(1).slice(0, -1))
    const embed = (interaction.message.embeds[0])
    // Ban-Action
    try {
      if (!empfangslog) {
        interaction.editReply({ content: 'No empfangslog channel found.' })
      } else {
        empfangslog.send({
          content: `${interaction.user.tag} hat ${target.user} aufgrund zu hohen Alters gebannt`
        })
      }
      const newmsg = (interaction.message.content) + '\nGebannt (Alter) durch: ' + String(interaction.user)
      embed.data.color = 15158332
      // Send User-Message
      const serverIcon = interaction.guild.iconURL()
      const toooldmessage = new EmbedBuilder()
        .setTitle('QueerCity Verifizierung')
        .setThumbnail(serverIcon)
        .setDescription(JSON.stringify(await get(ref(db, interaction.member.guild.id + '/einwohnermeldeamt/config/tooOldMsg'))).slice(1).slice(0, -1).replaceAll('\\n', '\n'))
        .setFooter({ text: 'QueerCity Verifizierungssystem', iconURL: serverIcon })
      try {
        await target.user.send({
          embeds: [toooldmessage]
        })
        await target.ban({ reason: '[QueerCity Verifizierungssystem]: User ist zu alt.\nGebannt (Alter) durch: ' + String(interaction.user) })
        interaction.editReply({
          content: 'User wurde aufgrund von zu hohem Alter gebannt. Nachricht gesendet',
          ephemeral: true
        })
      } catch (e) {
        await interaction.editReply({
          content: 'User wurde aufgrund von zu hohem Alter gebannt\nUser akzeptiert keine Nachricht',
          ephemeral: true
        })
      }
      // Message edit
      try {
        await interaction.message.edit({ components: [], embeds: [embed] })
        await interaction.message.edit(newmsg)
      } catch {
        return null
      }
    } catch (err) {
      interaction.editReply({ content: 'User konnte nicht gebannt werden. Bitte kontaktiere eine:n Administrator:in.' })
    }
  }
}
