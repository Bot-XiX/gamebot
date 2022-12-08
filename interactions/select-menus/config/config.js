/**
 * @file Select menu interaction: config
 * @since 1.0.0
*/
const { getDatabase, ref, set, get, onValue } = require('firebase/database')
const { ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, ButtonBuilder } = require('discord.js')
const { EmbedBuilder } = require('discord.js')
module.exports = {
  id: 'config',
  /**
* @description Executes when the select menu with ID config is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    let configRow
    if (interaction.values.includes('einwohnermeldeamt')) {
      //* ###########################################
      let enabled = JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/enabled'))).slice(1).slice(0, -1)
      if (!enabled) {
        await set(ref(db, id + '/einwohnermeldeamt/config/enabled'), 'false')
        enabled = 'false'
      }
      let eLogStr
      try {
        const eLog = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/eLog'))).slice(1).slice(0, -1))
        eLogStr = `[#${eLog.name}](https://discord.com/config/${eLog.guild.id}/${eLog.id})`
      } catch (e) {
        eLogStr = 'Nicht gefunden'
      }
      let VE2LogStr
      try {
        const VE2Log = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/ve2Log'))).slice(1).slice(0, -1))
        VE2LogStr = `[#${VE2Log.name}](https://discord.com/config/${VE2Log.guild.id}/${VE2Log.id})`
      } catch (e) {
        VE2LogStr = 'Nicht gefunden'
      }
      let VorstellungLogStr
      try {
        const VorstellungLog = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/vorstellungLog'))).slice(1).slice(0, -1))
        VorstellungLogStr = `[#${VorstellungLog.name}](https://discord.com/config/${VorstellungLog.guild.id}/${VorstellungLog.id})`
      } catch (e) {
        VorstellungLogStr = 'Nicht gefunden'
      }
      let VE2MsgEnabled = JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/VE2MsgEnabled'))).slice(1).slice(0, -1)
      if (!VE2MsgEnabled) {
        await set(ref(db, id + '/einwohnermeldeamt/config/VE2MsgEnabled'), 'false')
        VE2MsgEnabled = 'false'
      }
      let VE2Msg = JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/VE2Msg'))).slice(1).slice(0, -1)
      if (VE2Msg === 'ul') {
        VE2Msg = 'Nicht gefunden'
      }
      let incompleteMsg = JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/incompleteMsg'))).slice(1).slice(0, -1)
      if (incompleteMsg === 'ul') {
        incompleteMsg = 'Nicht gefunden'
      }
      let tooOldMsg = JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/tooOldMsg'))).slice(1).slice(0, -1)
      if (tooOldMsg === 'ul') {
        tooOldMsg = 'Nicht gefunden'
      }
      VE2Msg = VE2Msg.replaceAll('\\n', '\n')
      incompleteMsg = incompleteMsg.replaceAll('\\n', '\n')
      tooOldMsg = tooOldMsg.replaceAll('\\n', '\n')
      // ###########################################
      const empfangsteamEmbed = new EmbedBuilder()
        .setTitle('Einwohnermeldeamt Einstellungen')
        .addFields(
          { name: 'Modul aktiviert', value: enabled },
          { name: 'E-Log Channel', value: eLogStr },
          { name: 'Vorstellung-Log Channel', value: VorstellungLogStr },
          { name: 'Vorstellung-Embed', value: 'Bitte bearbeiten um anzuzeigen' },
          { name: 'VE2-Log Channel', value: VE2LogStr },
          { name: 'VE2-Nachricht aktiviert', value: VE2MsgEnabled },
          { name: 'VE2-Nachricht', value: VE2Msg },
          { name: 'Unvollständig-Nachricht', value: incompleteMsg },
          { name: 'Zu alt-Nachricht', value: tooOldMsg }
        )
      //! ###########################################
      configRow = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('configEinwohnermeldeamt')
            .setPlaceholder('Nothing selected')
            .addOptions([
              {
                label: 'Enable',
                description: 'Aktiviert das Einwohnermeldeamt',
                value: 'enabled'
              },
              {
                label: 'E-Log Channel',
                description: 'Ändere den E-Log Channel',
                value: 'elog'
              },
              {
                label: 'VE2-Log Channel',
                description: 'Ändere den VE2-Log Channel',
                value: 've2log'
              },
              {
                label: 'Vorstellung-Embed',
                description: 'Ändert das Vorstellung-Embed',
                value: 'vorstellungEmbed'
              },
              {
                label: 'Vorstellung-Log Channel',
                description: 'Ändere den Vorstellung-Log Channel',
                value: 'vorstellunglog'
              },
              {
                label: 'VE2-Message Enabled',
                description: 'Aktiviere/Deaktiviere die VE2-Nachricht',
                value: 've2msgenabled'
              },
              {
                label: 'VE2-Message',
                description: 'Ändere die VE2-Nachricht',
                value: 've2msg'
              },
              {
                label: 'Unvollständig-Message',
                description: 'Ändere die Nachricht für unvollständige Vorstellungen',
                value: 'incompletemsg'
              },
              {
                label: 'Zu Alt-Message',
                description: 'Ändere die Nachricht für zu alte Mitglieder',
                value: 'toooldmsg'
              }
            ])
        )
      const config2Row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('configempfangsteamrollen')
            .setLabel('Rollen bearbeiten')
            .setStyle(ButtonStyle.Primary) // Primary, Secondary, Success, Danger, Link
          // .setEmoji('EMOJI') // If you want to use an emoji
        )
      interaction.reply({
        content: 'Was magst du anpassen?',
        components: [configRow, config2Row],
        embeds: [empfangsteamEmbed],
        ephemeral: true,
        attachments: []
      })
    }
    // Role config
    if (interaction.values.includes('roles')) {
      const adminRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, id + '/roles/adminRole'))).slice(2, -1)}`)
      const modRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, id + '/roles/modRole'))).slice(2, -1)}`)
      // #######################################################################
      const anonymEmbed = new EmbedBuilder()
        .setTitle('Role Einstellungen')
        .addFields(
          { name: 'Admin Rolle', value: String(adminRole) },
          { name: 'Support Rolle', value: String(modRole) }
        )
      //! ###########################################
      configRow = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('configRoles')
            .setPlaceholder('Nothing selected')
            .addOptions([
              {
                label: 'Admin Rolle',
                description: 'Ändere die Admin Rolle',
                value: 'adminrole'
              },
              {
                label: 'Support Rolle',
                description: 'Ändere die Support Rolle',
                value: 'modrole'
              }
            ])
        )
      interaction.reply({
        content: 'Was magst du anpassen?',
        components: [configRow],
        embeds: [anonymEmbed],
        ephemeral: true,
        attachments: []
      })
    }
    // Ticket config
    if (interaction.values.includes('ticket')) {
      const adminTicketCount = JSON.stringify(await get(ref(db, id + '/tickets/config/count/admin')))
      const adminTicketCountOutput = ('0000' + adminTicketCount).slice(-4)
      const complaintCount = JSON.stringify(await get(ref(db, id + '/tickets/config/count/complaint')))
      const complaintCountOutput = ('0000' + complaintCount).slice(-4)
      const ticketConfigEmbed = new EmbedBuilder()
        .setTitle('Ticket Einstellungen')
        .addFields(
          { name: 'Admin Ticket Count', value: adminTicketCountOutput },
          { name: 'Beschwerde Count', value: complaintCountOutput }
        )
      //! ###########################################
      configRow = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('configTickets')
            .setPlaceholder('Nothing selected')
            .addOptions([
              {
                label: 'Admin Ticket Count',
                description: 'Setzt den Counter für Admin-Tickets zurück',
                value: 'adminticketcount'
              },
              {
                label: 'Beschwerde Ticket Count',
                description: 'Setzt den Counter für Beschwerden zurück',
                value: 'complaintcount'
              }
            ])
        )
      interaction.reply({
        content: 'Was magst du anpassen?',
        components: [configRow],
        embeds: [ticketConfigEmbed],
        ephemeral: true,
        attachments: []
      })
    }
    if (interaction.values.includes('games')) {
      const games = await ref(db, id + '/games')
      const gameSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('configGames')
        .setPlaceholder('Nothing selected')
      const unsub = onValue(games, async (snapshot) => {
        const games = snapshot.val()
        gameSelectMenu.addOptions([{ label: 'Spiel hinzufügen', value: 'addGame' }])
        for (const game in games) {
          gameSelectMenu.addOptions([{ label: games[game].name, value: game }])
        }
        const configRow = new ActionRowBuilder().addComponents(gameSelectMenu)
        const rowRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('addGameWaitingChannel')
              .setLabel('Set Waiting Channel')
              .setStyle(ButtonStyle.Primary), // Primary, Secondary, Success, Danger, Link
            // .setEmoji('EMOJI') // If you want to use an emoji
            new ButtonBuilder()
              .setCustomId('addGameRole')
              .setLabel('Set role')
              .setStyle(ButtonStyle.Primary), // Primary, Secondary, Success, Danger, Link
            new ButtonBuilder()
              .setCustomId('addPremiumRole')
              .setLabel('Set premium role')
              .setStyle(ButtonStyle.Primary) // Primary, Secondary, Success, Danger, Link
          )
        interaction.reply({
          content: 'Was magst du anpassen?',
          components: [configRow, rowRow],
          embeds: [],
          ephemeral: true,
          attachments: []
        })
        unsub()
      })
    }
    if (interaction.values.includes('customChannel')) {
      const customChannel = await ref(db, id + '/customChannels')
      const channelSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('configCustomChannel')
        .setPlaceholder('Nothing selected')
      const unsub = onValue(customChannel, async (snapshot) => {
        const channels = snapshot.val()
        channelSelectMenu.addOptions([{ label: 'Channel hinzufügen', value: 'addChannel' }])
        for (const channel in channels) {
          const name = interaction.guild.channels.cache.get(channels[channel].id).name
          channelSelectMenu.addOptions([{ label: channels[channel].id, description: name, value: channel }])
        }
        const configRow = new ActionRowBuilder().addComponents(channelSelectMenu)
        interaction.reply({
          content: 'Was magst du anpassen?',
          components: [configRow],
          embeds: [],
          ephemeral: true,
          attachments: []
        })
        unsub()
      })
    }
    if (interaction.values.includes('bump')) {
      const bumpChannel = interaction.guild.channels.cache.get(`${JSON.stringify(await get(ref(db, 'bump/' + id + '/channel'))).slice(1, -1)}`)
      const bumpRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, 'bump/' + id + '/role'))).slice(1, -1)}`)
      const bumpReady = JSON.stringify(await get(ref(db, 'bump/' + id + '/bumpReady'))).slice(1, -1)
      const bumpWait = JSON.stringify(await get(ref(db, 'bump/' + id + '/bumpWait'))).slice(1, -1)
      let bumpChannelReady = JSON.stringify(await get(ref(db, 'bump/' + id + '/channelReady'))).slice(1, -1)
      let bumpChannelWait = JSON.stringify(await get(ref(db, 'bump/' + id + '/channelWait'))).slice(1, -1)
      let bumpThanks = JSON.stringify(await get(ref(db, 'bump/' + id + '/thanks'))).slice(1, -1)
      const bumpDelEmbed = JSON.stringify(await get(ref(db, 'bump/' + id + '/delEmbed')))
      bumpChannelReady = bumpChannelReady.replaceAll('\\n', '\n')
      bumpChannelWait = bumpChannelWait.replaceAll('\\n', '\n')
      bumpThanks = bumpThanks.replaceAll('\\n', '\n')
      const bumpEmbed = new EmbedBuilder()
        .setTitle('Bump Einstellungen')
        .addFields(
          { name: 'Bump Channel', value: String(bumpChannel) },
          { name: 'Bump Role', value: String(bumpRole) },
          { name: 'Bump Ready Message', value: String(bumpReady) },
          { name: 'Bump Wait Message', value: String(bumpWait) },
          { name: 'Bump Channel Ready', value: String(bumpChannelReady) },
          { name: 'Bump Channel Wait', value: String(bumpChannelWait) },
          { name: 'Bump Thanks Message', value: String(bumpThanks) },
          { name: 'Bump Delete Embed', value: String(bumpDelEmbed) }
        )
      //! ###########################################
      configRow = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('configBump')
            .setPlaceholder('Nothing selected')
            .addOptions([
              {
                label: 'Bump Channel',
                description: 'Ändere den Bump Channel',
                value: 'bumpChannel'
              },
              {
                label: 'Bump Role',
                description: 'Ändere die Bump Rolle',
                value: 'bumpRole'
              },
              {
                label: 'Bump Ready Message',
                description: 'Ändere die Bump Ready Message',
                value: 'bumpReady'
              },
              {
                label: 'Bump Wait Message',
                description: 'Ändere die Bump Wait Message',
                value: 'bumpWait'
              },
              {
                label: 'Bump Channel Ready',
                description: 'Ändere den Bump Channel Ready Namen',
                value: 'bumpChannelReady'
              },
              {
                label: 'Bump Channel Wait',
                description: 'Ändere den Bump Channel Wait Namen',
                value: 'bumpChannelWait'
              },
              {
                label: 'Bump Thanks Message',
                description: 'Ändere die Bump Thanks Message',
                value: 'bumpThanks'
              },
              {
                label: 'Bump Delete Embed',
                description: 'Ändere die Bump Delete Einstellung',
                value: 'bumpDelEmbed'
              }
            ])
        )
      interaction.reply({
        content: 'Was magst du anpassen?',
        components: [configRow],
        embeds: [bumpEmbed],
        ephemeral: true,
        attachments: []
      })
    }
    module.exports.prev = { interaction, configRow }
  }
}
