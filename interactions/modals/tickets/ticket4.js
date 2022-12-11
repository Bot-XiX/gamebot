const { ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const { getDatabase, set, ref, get, onValue } = require("firebase/database")

/**
 * @file Modal interaction: ticket4
 * @since 1.0.0
*/
module.exports = {
  id: 'ticket4',
  /**
* @description Executes when the modal with ID ticket4 is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const target = interaction.member
    const id = interaction.guild.id
    const db = getDatabase()
    const configID = JSON.stringify(await get(ref(db, id + '/tickets/panels/' + interaction.message.id + '/config'))).slice(1, -1)
    const config = ref(db, id + '/tickets/config/' + configID + '/buttons/components/4')
    let modRoles
    let openCategory
    let name
    let counter = parseInt(JSON.stringify(await get(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/counter'))))
    if (counter) {
      counter++
      set(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/counter'), counter)
    } else {
      set(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/counter'), 1)
      counter = 1
    }
    const unsub = onValue(config, async (snapshot) => {
      const config = await snapshot.val()
      modRoles = config.modRoles
      openCategory = interaction.guild.channels.cache.get(config.channel)
      try {
        name = config.name
      } catch {
        name = 'ticket'
      }
      counter = ('0000' + counter).slice(-4)
      const channelName = `${name.toLowerCase()}-${counter}`
      try {
        const channel = await interaction.guild.channels.create({
          name: channelName,
          type: ChannelType.Text,
          parent: openCategory,
          permissionOverwrites: [{ id: interaction.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.EmbedLinks] }]
        })
        await channel.permissionOverwrites.edit(target, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true,
          AttachFiles: true,
          EmbedLinks: true
        })
        for (let i = 0; i < modRoles.length; i++) {
          await channel.permissionOverwrites.edit(modRoles[i], {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            AttachFiles: true,
            EmbedLinks: true,
            ManageChannels: true
          })
        }
        interaction.reply({ content: `${name} Ticket created.`, ephemeral: true })
        const rowRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('closeTicket')
              .setLabel('Ticket schließen')
              .setStyle(ButtonStyle.Danger) // Primary, Secondary, Success, Danger, Link
              .setEmoji('🔒') // If you want to use an emoji
          )
        const ticketEmbed = new EmbedBuilder()
          .setTitle(`${name} Ticket (#${counter})`)
          .setDescription(`${target.toString()} hat ein ${name}-Ticket erstellt.`)
          .setColor('#0099ff')
          .setTimestamp()
          .setFooter({
            text: `${name} Ticket | ${configID} | 0`
          })
        // Get modRoles mentions
        let modRole = ''
        for (let i = 0; i < modRoles.length; i++) {
          // check if modRole is a role
          if (interaction.guild.roles.cache.get(modRoles[i])) {
            modRole += `<@&${modRoles[i]}> `
          } else {
            modRole += `<@${modRoles[i]}> `
          }
        }
        const msg = channel.send({
          content: `Hey ${modRole}, ${target} hat ein Ticket für euch erstellt!`,
          embeds: [ticketEmbed],
          components: [rowRow]
        })
        // Get modals inputs length
        const amount = await get(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/modals/amount')).then((snapshot) => snapshot.val())
        for (let i = 0; i < amount; i++) {
          const modalTitle = await get(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/modals/' + i + '/name'))
          // Get
          const embed = new EmbedBuilder()
            .setTitle(modalTitle.val())
            .setDescription(interaction.fields.getTextInputValue(`modal${i}`))
          channel.send({ embeds: [embed] })
        }
        module.exports.prev = { interaction, rowRow, channel, msg }
      } catch (err) {
        return null
      }
      unsub()
    })
  }
}
