const { get, ref, getDatabase, set, onValue } = require('firebase/database')
const { PermissionsBitField, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder } = require('discord.js')
/**
 * @file Button interaction: ticket4
 * @since 1.0.0
*/
module.exports = {
  id: 'ticket4',
  /**
* @description Executes when the button with ID ticket4 is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    try {
      const target = interaction.member
      const id = interaction.guild.id
      const db = getDatabase()
      const configID = JSON.stringify(await get(ref(db, id + '/tickets/panels/' + interaction.message.id + '/config'))).slice(1, -1)
      const modalsEnabled = await get(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/modals/enabled')).then((snapshot) => snapshot.val())
      if (modalsEnabled) {
        const modalTitle = await get(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/modals/title')).then((snapshot) => snapshot.val())
        const modalModal = new ModalBuilder().setCustomId('ticket4').setTitle(modalTitle)
        const modalAmount = await get(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/modals/amount')).then((snapshot) => snapshot.val())
        const modalRows = []
        for (let i = 0; i < modalAmount; i++) {
          const modalRow = new ActionRowBuilder()
          const modalText = await get(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/modals/' + i + '/name')).then((snapshot) => snapshot.val())
          const modalPlaceholder = await get(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/modals/' + i + '/placeholder')).then((snapshot) => snapshot.val())
          const modalType = await get(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/modals/' + i + '/type')).then((snapshot) => snapshot.val())
          const modalRequired = await get(ref(db, id + '/tickets/config/' + configID + '/buttons/components/4/modals/' + i + '/required')).then((snapshot) => snapshot.val())
          modalRow.addComponents(new TextInputBuilder().setCustomId('modal' + i).setLabel(modalText).setPlaceholder(modalPlaceholder).setStyle(modalType).setRequired(modalRequired))
          modalRows.push(modalRow)
        }
        modalModal.addComponents(modalRows)
        return interaction.showModal(modalModal)
      }
      const config = ref(db, id + '/tickets/config/' + configID + '/buttons/components/4')
      let modRole
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
        modRole = interaction.guild.roles.cache.get(config.modRole)
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
          await channel.permissionOverwrites.edit(modRole, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            AttachFiles: true,
            EmbedLinks: true,
            ManageChannels: true
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
            .setTitle(`${name} Ticket (#${counter})`)
            .setDescription(`${target.toString()} hat ein ${name}-Ticket erstellt.\nBitte schildere hier dein Anliegen für die zuständigen User:innen!`)
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({
              text: `${name} Ticket | ${configID} | 4`
            })
          const msg = channel.send({
            content: `Hey ${modRole}, ${target} hat ein Ticket für euch erstellt!`,
            embeds: [ticketEmbed],
            components: [rowRow]
          })
          interaction.reply({ content: `${name} Ticket created.`, ephemeral: true })
          module.exports.prev = { interaction, rowRow, channel, msg }
        } catch (err) {
          return null
        }
        unsub()
      })
    } catch {
      interaction.reply({ content: 'Ein Fehler ist aufgetreten\nBitte gib einem Teammitglied Bescheid wenn er weiterhin auftritt.', ephemeral: true })
    }
  }
}
