const { SlashCommandBuilder } = require('discord.js')

/**
 * @file Slash interaction: checkwork

 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkwork')
    .setDescription('Überprüft, ob Freischaltungen ausstehen.'), // .addSubcommand((subcommand) => subcommand.setName().setDescription().add...)
  // .addStringOption((option) => option.setName().setDescription().setRequired())
  // .addIntegerOption((option) => option.setName().setDescription().setRequired())
  // .addBooleanOption((option) => option.setName().setDescription().setRequired())
  // .addUserOption((option) => option.setName().setDescription().setRequired())
  // .addChannelOption((option) => option.setName().setDescription().setRequired())
  // .addRoleOption((option) => option.setName().setDescription().setRequired())
  // .addMentionableOption((option) => option.setName().setDescription().setRequired())
  // .addNumberOption((option) => option.setName().setDescription().setRequired())
  // .addAttachmentOption((option) => option.setName().setDescription().setRequired())

  /**
  * @description Executes when the slash command with ID checkwork is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    function wait (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    const fetch = await interaction.channel.messages.fetch({
    })
    const array = Array.from(fetch)
    let count = 0
    for (let i = 0; i < array.length; i++) {
      const message = array[i][1]
      if (message.components.length > 0) {
        count++
      }
    }
    if (count === 0) {
      interaction.reply({
        content: 'Es sind keine Freischaltungen ausstehend.'
      })
    } else if (count === 1) {
      interaction.reply({
        content: 'Es ist eine Freischaltung ausstehend.'
      })
    } else {
      interaction.reply({
        content: 'Es sind ' + count + ' Freischaltungen ausstehend.'
      })
    }
    await wait(7000)
    interaction.deleteReply()
  }
}
