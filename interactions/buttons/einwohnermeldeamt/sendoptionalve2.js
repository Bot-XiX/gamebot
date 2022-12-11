/**
 * @file Button interaction: sendoptionalve2
 * @since 1.0.0
*/
module.exports = {
  id: 'sendoptionalve2',
  /**
* @description Executes when the button with ID sendoptionalve2 is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const target = interaction.guild.members.cache.get(interaction.message.content.split('\n')[0].slice(2, -1))
    try {
      target.user.send({
        embeds: interaction.message.embeds
      })
      interaction.reply({
        content: 'Nachricht gesendet',
        ephemeral: true
      })
    } catch (e) {
      interaction.reply({
        content: 'User akzeptiert keine Nachricht',
        ephemeral: true
      })
    }
  }
}
