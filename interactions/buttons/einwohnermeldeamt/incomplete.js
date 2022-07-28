const { SelectMenuBuilder } = require('@discordjs/builders')
const { ActionRowBuilder } = require('discord.js')
/**
 * @file Button interaction: incomplete

 * @since 1.0.0
*/
module.exports = {
  id: 'incomplete',
  /**
* @description Executes when the button with ID incomplete is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const target = interaction.guild.members.cache.get(interaction.message.content.split('\n')[0].slice(8).slice(0, -1))
    const incompleteRow = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
          .setCustomId('incompleteReason')
          .setPlaceholder('Wähle den Grund aus...')
          .setMinValues(1)
          .setMaxValues(6)
          .addOptions([
            {
              label: 'Name',
              description: 'Der Name des/der User:in.',
              value: 'name'
            },
            {
              label: 'Alter',
              description: 'Das Alter des/der User:in.',
              value: 'age'
            },
            {
              label: 'Wohnort',
              description: 'Der Wohnort des/der User:in.',
              value: 'place'
            },
            {
              label: 'Sexualität',
              description: 'Die Sexualität des/der User:in.',
              value: 'sexuality'
            },
            {
              label: 'Gender',
              description: 'Das Gender/die Pronomen des/der User:in.',
              value: 'gender'
            },
            {
              label: 'Hobbies',
              description: 'Die Hobbies des/der User:in.',
              value: 'hobbies'
            }
          ])
      )
    // An action row only holds one text input,
    // Add inputs to the modal
    interaction.reply({
      content: 'Bitte wähle den Grund aus...',
      components: [incompleteRow],
      ephemeral: true
    })
    // Show the modal to the user
    const embed = interaction.message.embeds[0]
    module.exports.prev = { target, embed, interaction }
  }
}
