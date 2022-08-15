const { ChannelType, PermissionsBitField, GuildScheduledEventStatus, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const { get, ref, getDatabase } = require("firebase/database")

/**
 * @file Button interaction: startEvent
 * @since 1.0.0
*/
module.exports = {
  id: 'startEvent',
  /**
* @description Executes when the button with ID startEvent is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    await interaction.deferReply({ ephemeral: true })
    const events = interaction.guild.scheduledEvents.cache
    for (let event of events.values()) {
      if (event.description.includes(interaction.user.toString())) {
        const channel = await interaction.guild.channels.create({
          name: event.name+' '+interaction.user.tag,
          type: ChannelType.GuildVoice,
          parent: interaction.guild.channels.cache.get(JSON.stringify(await get(ref(getDatabase(), interaction.guild.id + '/game/waitingChannel'))).slice(1, -1)).parent,
          permissionOverwrites: [{ id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.MoveMembers, PermissionsBitField.Flags.MuteMembers] }],
          userLimit: parseInt(event.description.split(' ')[3])+1
        })
        const newButton = ButtonBuilder.from(interaction.message.components[0].components[0]).setDisabled(true)
        interaction.message.edit({ components: [new ActionRowBuilder().addComponents(newButton, interaction.message.components[0].components[1], interaction.message.components[0].components[2])] })
        await event.edit({ channel: channel })
        event.setStatus(GuildScheduledEventStatus.Active)
        interaction.editReply({ content: 'Event gestartet!' })
      } else {
        interaction.editReply({ content: "Du bist nicht Besitzer dieses Events" })
      }
    }
  }
}
