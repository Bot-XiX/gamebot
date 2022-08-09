const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { ref, getDatabase, onValue, set } = require('firebase/database')
/**
 * @file Slash interaction: showticket
 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('showticket')
    .setDescription('Show a ticket panel')
    .addStringOption((option) => option.setName('id').setDescription('Ticket ID').setRequired(true)),
  /**
  * @description Executes when the slash command with ID showticket is called.

  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const id = interaction.guild.id
    const db = getDatabase()
    const ticket = ref(db, id + '/tickets/config/' + interaction.options.getString('id'))
    if (!ticket) {
      interaction.reply({ content: 'No ticket found.' })
    } else {
      interaction.reply({ content: 'Ticket found.' })
      const unsub = onValue(ticket, async (snapshot) => {
        const config = await snapshot.val()
        const key = snapshot.key
        const embed = EmbedBuilder.from(config.embed.data)
        const buttons = new ActionRowBuilder()
        for (let i = 0; i < config.buttons.components.length; i++) {
          buttons.addComponents(ButtonBuilder.from(config.buttons.data.components[i]))
        }
        interaction.channel.send({ embeds: [embed], components: [buttons] }).then((msg) => {
          set(ref(db, id + '/tickets/panels/' + msg.id + '/config'), key)
        })
        unsub()
      })
    }
  }
}
