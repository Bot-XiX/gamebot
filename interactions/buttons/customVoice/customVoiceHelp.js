const { PermissionsBitField, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require('discord.js')
/**
 * @file Button interaction: customVoiceHelp
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceHelp',
  /**
* @description Executes when the button with ID customVoiceHelp is called.
* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const channel = interaction.channel
    const embed = new EmbedBuilder()
      .setTitle('Custom Voice Hilfe')
      .setDescription('Hier findest du eine Übersicht über alle Befehle und Funktionen von Custom Voice.')
      .addFields(
        {
          name: '➕',
          value: 'Erhöht das Userlimit um 1'
        },
        {
          name: '➖',
          value: 'Verringert das Userlimit um 1'
        },
        {
          name: '📝',
          value: 'Ändert den Namen des Channels'
        },
        {
          name: '🔒',
          value: 'Je nach Status ist der Channel für alle, deine Freunde oder niemanden offen.'
        },
        {
          name: '🔑',
          value: 'Gib jemand die Berechtigung, den Channel zu betreten.'
        },
        {
          name: '🔨',
          value: 'Banne oder entbanne jemanden aus dem Channel.'
        },
        {
          name: '🫂',
          value: 'Füge jemanden zu deinen Freunden hinzu, sodass er deinen Channel im Nur-Freunde-Modus betreten kann.'
        },
        {
          name: '🎮',
          value: 'Starte ein Discord-Spiel mit deinen Freunden.'
        },
        {
          name: '👑',
          value: 'Werde der Besitzer des Channels, wenn der Besitzer nicht mehr im Channel ist.'
        })
    interaction.reply({
      embeds: [embed],
      components: [],
      ephemeral: true
    }
    )
  }
}
