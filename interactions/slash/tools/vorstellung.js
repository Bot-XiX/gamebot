const { SlashCommandBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js')
const { getDatabase, ref, onValue } = require('firebase/database')

/**
 * @file Slash interaction: vorstellung

 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('vorstellung')
    .setDescription('Placeholder'),
  /**
* @description Executes when the slash command with ID vorstellung is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    const embed = ref(db, id + '/einwohnermeldeamt/config/vorstellungEmbed/data')
    const unsub = onValue(embed, async (snapshot) => {
      const embed = await snapshot.val()
      if (!embed) {
        interaction.reply({ content: 'No embed found.' })
        return
      }
      const embedMsg = await new EmbedBuilder(embed)
      const newRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('vorstellungstarten')
            .setLabel('Verifikation starten')
            .setStyle(ButtonStyle.Primary) // Primary, Secondary, Success, Danger, Link
            .setEmoji('🛫') // If you want to use an emoji
        )
      // Add the row to the message
      try {
        interaction.channel.send({
          embeds: [embedMsg],
          components: [newRow]
        })
        interaction.reply({ content: 'Message sent.', ephemeral: true })
      } catch (e) {
        interaction.reply({
          content: 'Kein Vorstellungs-Embed vorhanden.',
          ephemeral: true
        })
      }
      unsub()
    }
    )
  }
}
