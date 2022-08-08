const { PermissionsBitField, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { ref, get, set, getDatabase } = require('firebase/database')

/**
 * @file Button interaction: createadminticket

 * @since 1.0.0
*/
module.exports = {
  id: 'createadminticket', // 1. Export
  /**
  * @description Executes when the button with ID createadminticket is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) { //2. Export
    const db = getDatabase()
    const id = interaction.guild.id
    const target = interaction.member
    const parent = interaction.guild.channels.cache.get((interaction.guild.channels.cache.get(interaction.message.channelId)).parentId)
    const adminRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, id + '/roleconfig/roles/adminRole'))).slice(2, -1)}`)
    // await set(ref(db, id + '/tickets/config/count/admin'), parseInt(1))
    let adminTicketID = JSON.stringify(await get(ref(db, id + '/tickets/config/count/admin')))
    const channelID = ('0000' + adminTicketID).slice(-4)
    const channelName = `admin-${channelID}` // Arguments to set the channel name
    adminTicketID++
    await set(ref(db, id + '/tickets/config/count/admin'), adminTicketID)
    try {
      const channel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.Text,
        parent,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone, // To make it be seen by a certain role, user an ID instead
            deny: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          },
          {
            id: target, // To make it be seen by a certain role, user an ID instead
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ],
            deny: [
              PermissionsBitField.Flags.ManageChannels
            ]
          },
          {
            id: adminRole, // To make it be seen by a certain role, user an ID instead
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
              PermissionsBitField.Flags.ManageChannels
            ],
            deny: [
            ]
          }
        ]
      })
      const rowRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('closeTicket')
            .setLabel('Ticket schließen')
            .setStyle(ButtonStyle.Danger) // Primary, Secondary, Success, Danger, Link
            .setEmoji('🔒') // If you want to use an emoji
        )
      const ticketEmbed = new EmbedBuilder()
        .setTitle(`Admin Ticket (#${channelID})`)
        .setDescription(`${target.toString()} hat ein Admin-Ticket erstellt.\nBitte schildere hier dein Anliegen für die Administrator:innen!`)
        .setColor('#0099ff')
        .setTimestamp()
        .setFooter({
          text: `Admin Ticket | ${target.id.toString()}`
        })
      const msg = channel.send({
        content: `Hey ${adminRole}, ${target} hat ein Ticket für euch erstellt!`,
        embeds: [ticketEmbed],
        components: [rowRow]
      })
      interaction.reply({ content: 'Admin Ticket created.', ephemeral: true })
      module.exports.prev = { interaction, rowRow, channel, msg }
    } catch (err) {
      console.log(err)
    }
  }
}
