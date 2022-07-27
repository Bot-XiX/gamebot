/**
 * @file Context menu (type:type) interaction: User avatar * @since 1.0.0
*/

const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')

module.exports = {
  data: {
    name: 'Server avatar',
    type: 2
    // 2 is for user context menus
    // 3 is for message context menus
  },
  /**
   * @description Executes when the context option with name "Tools" is clicked.
   * @param {Object} interaction The Interaction Object of the command.
   */
  async execute (interaction) {
    const target = interaction.targetMember
    const avatar = target.avatarURL({ format: 'png', dynamic: true, size: 1024 })
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${target.user.tag}'s avatar`)
      .setImage(avatar)
      // .setFooter({ name: `Requested by ${interaction.user.tag}` })

    const row = new ActionRowBuilder()
    try {
      const download = new ButtonBuilder()
        .setURL(target.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .setLabel('Download avatar')
        .setStyle(ButtonStyle.Link)
      row.addComponents(download)
    } catch (e) {
      return
    }

    // Add the row to the message
    interaction.reply({
      components: [row],
      ephemeral: true,
      embeds: [embed]
    })
    module.exports.interaction = interaction
  }
}
