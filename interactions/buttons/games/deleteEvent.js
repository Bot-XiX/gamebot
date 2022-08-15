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
    await interaction.deferReply({ ephemeral: true })
    const events = interaction.guild.scheduledEvents.cache
    for (let event of events.values()) {
      if (event.description.includes(interaction.user.toString()) && interaction.message.embeds[0].author.name.includes(interaction.user.tag)) {
        try {
          event.delete()
        } catch {
          null
        }
        interaction.editReply({ content: "Event geschlossen" })
        interaction.message.delete()
        try {
          interaction.guild.channels.cache.find(channel => channel.name === event.name+' '+interaction.user.tag).delete()
        } catch {
          null
        }
      } else {
        interaction.editReply({ content: "Du bist nicht Besitzer dieses Events" })
      }
    }
  }
}
