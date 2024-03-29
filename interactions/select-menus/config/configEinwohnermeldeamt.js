/**
 * @file Select menu interaction: configEinwohnermeldeamt
 * @since 1.0.0
*/
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js')
const prev = require('./config')
const { set, ref, get, getDatabase } = require('firebase/database')
module.exports = {
  id: 'configEinwohnermeldeamt',
  /**
* @description Executes when the select menu with ID configEinwohnermeldeamt is called.

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
    prev.prev.interaction.editReply({
      components: [prev.prev.configRow]
    })
    if (interaction.values.includes('enabled')) {
      const enabled = JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/enabled'))).slice(1).slice(0, -1)
      if (enabled === 'false') {
        await set(ref(db, id + '/einwohnermeldeamt/config/enabled'), 'true')
        interaction.reply({ content: 'Module enabled.', ephemeral: true })
      } else {
        await set(ref(db, id + '/einwohnermeldeamt/config/enabled'), 'false')
        interaction.reply({ content: 'Module disabled.', ephemeral: true })
      }
    }
    if (interaction.values.includes('elog')) {
      interaction.reply({
        content: 'Please mention the channel where the E-logs should be sent to.',
        ephemeral: true
      })
      collect().then(async (m) => {
        await set(ref(db, id + '/einwohnermeldeamt/config/eLog'), m.first().content.slice(2).slice(0, -1))
        const eLog = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/eLog'))).slice(1).slice(0, -1))
        interaction.editReply({ content: `Logs will be sent to ${eLog}` })
        m.first().delete()
      })
    }
    if (interaction.values.includes('ve2log')) {
      interaction.reply({
        content: 'Please mention the channel where the VE2-logs should be sent to.',
        ephemeral: true
      })
      collect().then(async (m) => {
        await set(ref(db, id + '/einwohnermeldeamt/config/ve2Log'), m.first().content.slice(2).slice(0, -1))
        const ve2Log = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/ve2Log'))).slice(1).slice(0, -1))
        interaction.editReply({ content: `Logs will be sent to ${ve2Log}` })
        m.first().delete()
      })
    }
    if (interaction.values.includes('vorstellungEmbed')) {
      const vorstellungEmbed = new EmbedBuilder()
        .setTitle('Placeholder title')
      const editEmbedRow = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('editVorstellungEmbed')
            .setPlaceholder('Nothing selected')
            .addOptions([
              {
                label: 'Title',
                value: 'title'
              },
              {
                label: 'URL',
                value: 'url'
              },
              {
                label: 'Author',
                value: 'author'
              },
              {
                label: 'Description',
                value: 'description'
              },
              {
                label: 'Thumbnail',
                value: 'thumbnail'
              },
              {
                label: 'Color',
                value: 'color'
              },
              {
                label: 'Image',
                value: 'image'
              },
              {
                label: 'Footer',
                value: 'footer'
              }
            ])
        )
      const saveEmbedRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('saveVorstellungEmbed')
            .setLabel('Save')
            .setStyle(ButtonStyle.Success)
        )
      const msg = interaction.reply({
        components: [editEmbedRow, saveEmbedRow],
        attachments: [],
        embeds: [vorstellungEmbed]
      })
      module.exports.prev = { interaction, vorstellungEmbed, editEmbedRow, saveEmbedRow, msg }
    }
    if (interaction.values.includes('vorstellunglog')) {
      interaction.reply({
        content: 'Please mention the channel where the Vorstellung-logs should be sent to.',
        ephemeral: true
      })
      collect().then(async (m) => {
        await set(ref(db, id + '/einwohnermeldeamt/config/vorstellungLog'), m.first().content.slice(2).slice(0, -1))
        const vorstellungLog = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/vorstellungLog'))).slice(1).slice(0, -1))
        interaction.editReply({ content: `Logs will be sent to ${vorstellungLog}` })
        m.first().delete()
      })
    }
    if (interaction.values.includes('ve2msgenabled')) {
      if (JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/VE2MsgEnabled'))).slice(1).slice(0, -1) === 'true') {
        await set(ref(db, id + '/einwohnermeldeamt/config/VE2MsgEnabled'), 'false')
        interaction.reply({ content: 'VE2-Messages are disabled.', ephemeral: true })
      } else if (JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/VE2MsgEnabled'))).slice(1).slice(0, -1) === 'false') {
        await set(ref(db, id + '/einwohnermeldeamt/config/VE2MsgEnabled'), 'optional')
        interaction.reply({ content: 'VE2-Messages are optional.', ephemeral: true })
      } else {
        await set(ref(db, id + '/einwohnermeldeamt/config/VE2MsgEnabled'), 'true')
        interaction.reply({ content: 'VE2-Messages are enabled.', ephemeral: true })
      }
    }
    if (interaction.values.includes('ve2msg')) {
      interaction.reply({
        content: 'Please send the VE2-message.',
        ephemeral: true
      })
      collect().then(async (m) => {
        await set(ref(db, id + '/einwohnermeldeamt/config/VE2Msg'), m.first().content)
        interaction.editReply({ content: `**VE2-Message is set to:**\n${m.first().content}` })
        m.first().delete()
      })
    }
    if (interaction.values.includes('incompletemsg')) {
      interaction.reply({
        content: 'Please send the incomplete-message.',
        ephemeral: true
      })
      collect().then(async (m) => {
        await set(ref(db, id + '/einwohnermeldeamt/config/incompleteMsg'), m.first().content)
        interaction.editReply({ content: `**Incomplete-Message is set to:**\n${m.first().content}` })
        m.first().delete()
      })
    }
    if (interaction.values.includes('toooldmsg')) {
      interaction.reply({
        content: 'Please send the too old-message.',
        ephemeral: true
      })
      collect().then(async (m) => {
        await set(ref(db, id + '/einwohnermeldeamt/config/tooOldMsg'), m.first().content)
        interaction.editReply({ content: `**Zu alt-Message is set to:**\n${m.first().content}` })
        m.first().delete()
      })
    }
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
    prev.prev.interaction.editReply({
      embeds: [empfangsteamEmbed]
    })
  }
}
