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
      if (event.description.includes(interaction.user.toString()) && interaction.message.embeds[0].author.name.includes(interaction.user.tag)) {
        try {
          await event.delete()
        } catch (e) {
          console.log(e)
        }
        interaction.reply({ content: 'Event geschlossen', ephemeral: true })
        interaction.message.delete()
        try {
          interaction.guild.channels.cache.find(channel => channel.name === event.name+' '+interaction.user.tag).delete()
        } catch {
          null
        }
      }
    }
  }
}
