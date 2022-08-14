/**
 * @file Button interaction: deleteEvent
 * @since 1.0.0
*/
module.exports = {
  id: 'deleteEvent',
  /**
* @description Executes when the button with ID deleteEvent is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const events = interaction.guild.scheduledEvents.cache
    for (let event of events.values()) {
      console.log(event)
      if (event.description.includes(interaction.user.toString())) {
        event.delete()
        interaction.reply({ content: "Event geschlossen", ephemeral: true })
        interaction.message.edit({ content: 'Event wurde geschlossen', components: [] })
      }
    }
  }
}
