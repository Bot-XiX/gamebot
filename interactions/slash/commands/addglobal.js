/**
* @file Slash interaction: addglobal
* @author Felix * @since 1.0.0
*/
const { SlashCommandBuilder, Collection } = require('discord.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('addglobal')
    .setDescription('Push command to all servers.')
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('Category')
        .setRequired(true)
        .addChoices(
          { name: 'slash', value: 'slash' },
          { name: 'context-menus', value: 'context-menus' }
        )
    )
    .addStringOption((option) =>
      option
        .setName('module')
        .setDescription('module')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('command')
        .setRequired(true)
    ),

  /**
* @description Executes when the slash command with ID label is called.
* @author Felix
* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    await interaction.deferReply()
    const client = interaction.client.application
    client.slashCommands = new Collection()
    client.buttonCommands = new Collection()
    client.modalCommands = new Collection()
    client.selectCommands = new Collection()
    client.contextCommands = new Collection()
    const command = require(`../../../interactions/${interaction.options.getString('category')}/${interaction.options.getString('module')}/${interaction.options.getString('command')}`)
    if (interaction.options.getString('category') === 'slash') {
      client.slashCommands.set(command.data.name, command)
    } else if (interaction.options.getString('category') === 'context-menus') {
      const keyName = `${interaction.options.getString('module').toUpperCase()} ${command.data.name}`
      client.contextCommands.set(keyName, command)
    } else {
      null
    }
    // Registration of Slash-Commands in Discord API
    const commandJsonData = [
      ...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
      ...Array.from(client.contextCommands.values()).map((c) => c.data)
    ]
    client.commands.create(commandJsonData[0])
    interaction.editReply({ content: 'Command added.' })
    return null
  }
}
