module.exports = {
  name: 'interactionCreate',

  /**
   * @description Executes when an interaction is created and handle it.

   * @param {Object} interaction The interaction which was created
   */

  async execute (interaction) {
    // Deconstructed client from interaction object.
    const { client } = interaction

    // Checks if the interaction is a select menu interaction (to prevent weird bugs)

    if (!interaction.isStringSelectMenu()) return
    /**
     * @description The Interaction command object
     * @type {Object}
     */

    const command = client.selectCommands.get(interaction.customId)

    // If the interaction is not a command in cache, return error message.
    // You can modify the error message at ./messages/defaultSelectError.js file!

    if (!command) {
      await require('../messages/defaultSelectError').execute(interaction)
      return
    }

    // A try to execute the interaction.

    try {
      await command.execute(interaction)
      return
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
      await client.users.fetch('605740766345822218').then(function (user) {
        user.send({ content: '**Error in *' + command.data.name + '*:**\n\n' + err + '\n\n**Data:**\n\n' + interaction })
      })
      try {
        await interaction.reply({
          content: 'There was an issue while executing that select menu option!',
          ephemeral: true
        })
      } catch {
        await interaction.editReply({
          content: 'There was an issue while executing that select menu option!',
          ephemeral: true
        })
      }
    }
  }
}
