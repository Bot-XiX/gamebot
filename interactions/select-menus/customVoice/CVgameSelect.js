const { EmbedBuilder } = require('@discordjs/builders')

/**
 * @file Select menu interaction: CVgameSelect
 * @since 1.0.0
*/
module.exports = {
  id: 'CVgameSelect',
  /**
  * @description Executes when the select menu with ID CVgameSelect is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const invite = await interaction.client.guilds.cache
      .get(interaction.guildId)
      .members.cache.get(interaction.member.user.id)
      .voice.channel.createInvite({
        maxAge: 604799, // 1 week
        maxUses: 100,
        targetType: 2,
        targetApplication: interaction.values[0]
      })
    const embed = new EmbedBuilder()
      .setTitle('Invite Link')
      .setDescription(
        'https://discord.gg/' + invite
      )
    if (invite) {
      await interaction.reply({
        embeds: [embed]
      })
    }
  }
}
