const { PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js')
const { ref, get, set, getDatabase } = require('firebase/database')

/**
 * @file Button interaction: createcomplaint

 * @since 1.0.0
*/
module.exports = {
  id: 'createcomplaint',
  /**
  * @description Executes when the button with ID createcomplaint is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    const target = interaction.member
    const parent = interaction.guild.channels.cache.get((interaction.guild.channels.cache.get(interaction.message.channelId)).parentId)
    const adminRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, id + '/roleconfig/roles/adminRole'))).slice(2, -1)}`)
    const modRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, id + '/roleconfig/roles/modRole'))).slice(2, -1)}`)
    // await set(ref(db, id + '/tickets/config/count/admin'), parseInt(1))
    let complaintID = JSON.stringify(await get(ref(db, id + '/tickets/config/count/complaint')))
    const channelID = ('0000' + complaintID).slice(-4)
    const channelName = `beschw-${channelID}` // Arguments to set the channel name
    complaintID++
    await set(ref(db, id + '/tickets/config/count/complaint'), complaintID)
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
          },
          {
            id: modRole, // To make it be seen by a certain role, user an ID instead
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
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('Beschwerde')
            .setDescription(`${target.toString()} has created an admin ticket.`)
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({
              text: 'Beschwerde'
            })
        ]
      })
      interaction.reply({ content: 'Beschwerde Ticket created.', ephemeral: true })
    } catch (err) {
      console.log(err)
    }
  }
}
