const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { get, ref, getDatabase } = require('firebase/database')

/**
 * @file Modal interaction: vorstellung

 * @since 1.0.0
*/
module.exports = {
  id: 'vorstellung',
  /**
* @description Executes when the modal with ID vorstellung is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    const log = interaction.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/vorstellungLog'))).slice(1).slice(0, -1))
    if (interaction.fields.getTextInputValue('nameAndAge') &&
      interaction.fields.getTextInputValue('location') &&
      interaction.fields.getTextInputValue('sexuality') &&
      interaction.fields.getTextInputValue('gender') &&
      interaction.fields.getTextInputValue('hobbies')
    ) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Vorstellung von ${interaction.user.tag}`,
          iconURL: interaction.member.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        })
        .setThumbnail(interaction.member.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .addFields(
          { name: 'Name&Alter', value: interaction.fields.getTextInputValue('nameAndAge') },
          { name: 'Wohnort', value: interaction.fields.getTextInputValue('location') },
          { name: 'Sexualität', value: interaction.fields.getTextInputValue('sexuality') },
          { name: 'Gender/Pronomen', value: interaction.fields.getTextInputValue('gender') },
          { name: 'Hobbies', value: interaction.fields.getTextInputValue('hobbies') }
        )
      try {
        const buttonRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('acceptuser')
              .setLabel('Tourist freischalten')
              .setStyle(ButtonStyle.Success), // Primary, Secondary, Success, Danger, Link
            // .setEmoji('EMOJI') // If you want to use an emoji
            new ButtonBuilder()
              .setCustomId('acceptolduser')
              .setLabel('Einwohner freischalten')
              .setStyle(ButtonStyle.Success), // Primary, Secondary, Success, Danger, Link
            new ButtonBuilder()
              .setCustomId('incomplete')
              .setLabel('Unvollständig')
              .setStyle(ButtonStyle.Danger), // Primary, Secondary, Success, Danger, Link
            new ButtonBuilder()
              .setCustomId('declineuser')
              .setLabel('VE2')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId('tooold')
              .setLabel('Zu alt')
              .setStyle(ButtonStyle.Danger)
            // new ButtonBuilder()
            //   .setCustomId('banuser')
          )
        const delRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('delete')
              .setLabel('Löschen')
              .setStyle(ButtonStyle.Danger)
          )
        const joinTimestamp = `<t:${Math.floor(interaction.member.joinedTimestamp / 1000)}:f>`
        const createTimestamp = `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:f>`
        log.send({
          content: `User: ${interaction.user.toString()} \nUser-ID: ${interaction.user.id}\nAccount erstellt: ${createTimestamp}\nServer beigetreten: ${joinTimestamp}`,
          embeds: [embed],
          components: [buttonRow, delRow]
        })
        const role = interaction.guild.roles.cache.get('926239165463556126')
        interaction.reply({ content: `Deine Vorstellung wurde gesendet! Das ${role} wird sich zeitnah um die Freischaltung kümmern.`, ephemeral: true })
      } catch {
        return null
      }
    } else {
      interaction.reply({ content: 'Bitte fülle alle Felder aus.', ephemeral: true })
    }
  }
}
