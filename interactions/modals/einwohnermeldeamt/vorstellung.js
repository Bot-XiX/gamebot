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
    if (interaction.fields.getTextInputValue('name') &&
        interaction.fields.getTextInputValue('age') &&
        interaction.fields.getTextInputValue('location') &&
        interaction.fields.getTextInputValue('gender') &&
        interaction.fields.getTextInputValue('hobbies')
    ) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Vorstellung von ${interaction.user.tag}`,
          iconURL: interaction.member.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        })

        .addFields(
          { name: 'Name', value: interaction.fields.getTextInputValue('name') },
          { name: 'Alter', value: interaction.fields.getTextInputValue('age') },
          { name: 'Wohnort', value: interaction.fields.getTextInputValue('location') },
          { name: 'Sexualität + Gender/Pronomen', value: interaction.fields.getTextInputValue('gender') },
          { name: 'Hobbies', value: interaction.fields.getTextInputValue('hobbies') }
        )
      try {
        const buttonRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('acceptuser')
              .setLabel('Freischalten')
              .setStyle(ButtonStyle.Success), // Primary, Secondary, Success, Danger, Link
            // .setEmoji('EMOJI') // If you want to use an emoji
            new ButtonBuilder()
              .setCustomId('declineuser')
              .setLabel('VE2')
              .setStyle(ButtonStyle.Danger)
          // new ButtonBuilder()
          //   .setCustomId('banuser')
          )
        // Add the row to the message
        log.send({ content: (interaction.user).toString() + '\n' + interaction.user.id, embeds: [embed], components: [buttonRow] })
        interaction.reply({ content: 'Deine Vorstellung wurde gesendet! Das <@926239165463556126> wird sich zeitnah um die Freischaltung kümmern.', ephemeral: true })
      } catch {
        return null
      }
    } else {
      interaction.reply({ content: 'Bitte fülle alle Felder aus.', ephemeral: true })
    }
  }
}
