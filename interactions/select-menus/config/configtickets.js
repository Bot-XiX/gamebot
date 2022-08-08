const { EmbedBuilder } = require('discord.js')
const { ref, set, getDatabase, get } = require('firebase/database')
const prev = require('./config')

/**
 * @file Select menu interaction: ticketconfig

 * @since 1.0.0
*/
module.exports = {
  id: 'ticketconfig',
  /**
  * @description Executes when the select menu with ID ticketconfig is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    function collect () {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1 })
      return msg
    }
    if (interaction.values.includes('adminticketcount')) {
      interaction.reply({ content: 'Bist du sicher, dass du den Admin Ticket Count zurücksetzen möchtest? Schreib "Ja", ansonsten schreib irgendetwas anderes.', ephemeral: true })
      collect().then(async (m) => {
        if (m.first().content === 'Ja') {
          await set(ref(db, id + '/tickets/config/count/admin'), parseInt(1))
          await interaction.editReply({ content: 'Admin Ticket Count wurde zurückgesetzt.' })
          m.first().delete()
          // #############################################
          const adminTicketCount = JSON.stringify(await get(ref(db, id + '/tickets/config/count/admin')))
          const adminTicketCountOutput = ('0000' + adminTicketCount).slice(-4)
          const complaintCount = JSON.stringify(await get(ref(db, id + '/tickets/config/count/complaint')))
          const complaintCountOutput = ('0000' + complaintCount).slice(-4)
          const ticketConfigEmbed = new EmbedBuilder()
            .setTitle('Ticket Einstellungen')
            .addFields(
              { name: 'Admin Ticket Count', value: adminTicketCountOutput },
              { name: 'Beschwerde Ticket Count', value: complaintCountOutput }
            )
          prev.prev.interaction.editReply({
            embeds: [ticketConfigEmbed]
          })
          // #############################################
        } else {
          await interaction.editReply({ content: 'Der Admin Ticket Count wurde **nicht** zurückgesetzt.', ephemeral: true })
        }
      })
    }
    if (interaction.values.includes('complaintcount')) {
      interaction.reply({ content: 'Bist du sicher, dass du den Beschwerde Count zurücksetzen möchtest? Schreib "Ja", ansonsten schreib irgendetwas anderes.', ephemeral: true })
      collect().then(async (m) => {
        if (m.first().content === 'Ja') {
          await set(ref(db, id + '/tickets/config/count/complaint'), parseInt(1))
          await interaction.editReply({ content: 'Beschwerde Count wurde zurückgesetzt.' })
          m.first().delete()
          // #############################################
          const adminTicketCount = JSON.stringify(await get(ref(db, id + '/tickets/config/count/admin')))
          const adminTicketCountOutput = ('0000' + adminTicketCount).slice(-4)
          const complaintCount = JSON.stringify(await get(ref(db, id + '/tickets/config/count/complaint')))
          const complaintCountOutput = ('0000' + complaintCount).slice(-4)
          const ticketConfigEmbed = new EmbedBuilder()
            .setTitle('Ticket Einstellungen')
            .addFields(
              { name: 'Admin Ticket Count', value: adminTicketCountOutput },
              { name: 'Beschwerde Ticket Count', value: complaintCountOutput }
            )
          prev.prev.interaction.editReply({
            embeds: [ticketConfigEmbed]
          })
          // #############################################
        } else {
          await interaction.editReply({ content: 'Der Beschwerde Count wurde **nicht** zurückgesetzt.', ephemeral: true })
        }
      })
    }
  }
}
