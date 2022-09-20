const { EmbedBuilder } = require('discord.js')
const { set, ref, getDatabase, get, remove } = require('firebase/database')
const prev = require('./config')

/**
 * @file Select menu interaction: configBump
 * @since 1.0.0
*/
module.exports = {
  id: 'configBump',
  /**
* @description Executes when the select menu with ID configBump is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    function collect () {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1 })
      return msg
    }
    try {
      prev.prev.interaction.editReply({
        components: [interaction.message.components[0]]
      })
      const db = getDatabase()
      const id = interaction.guild.id
      if (interaction.values.includes('bumpChannel')) {
        interaction.reply({
          content: 'Bitte erwähne den Bump-Channel',
          ephemeral: true
        })
        const msg = await collect()
        const channelID = msg.first().content.slice(2, -1)
        await set(ref(db, 'bump/' + id + '/channel'), channelID)
        msg.first().delete()
      }
      if (interaction.values.includes('bumpRole')) {
        interaction.reply({
          content: 'Bitte erwähne die BumpRole',
          ephemeral: true
        })
        const msg = await collect()
        const roleID = msg.first().content.slice(3, -1)
        await set(ref(db, 'bump/' + id + '/role'), roleID)
        msg.first().delete()
      }
      if (interaction.values.includes('bumpReady')) {
        interaction.reply({
          content: 'Bitte sende die Nachricht, die gesendet werden soll, wenn der Bump bereit ist\nSende `none`, um die Nachricht zu deaktivieren\nPlaceholders: {role} - BumpRole | {channel} - BumpChannel | {server} - Server | {category} - Category',
          ephemeral: true
        })
        const msg = await collect()
        const ready = msg.first().content
        if (ready === 'none') {
          await remove(ref(db, 'bump/' + id + '/bumpReady'))
        } else {
          await set(ref(db, 'bump/' + id + '/bumpReady'), ready)
        }
        msg.first().delete()
      }
      if (interaction.values.includes('bumpWait')) {
        interaction.reply({
          content: 'Bitte sende die Nachricht, die gesendet wird, nachdem der Bump abgeschlossen ist und wann der nächste Bump möglich ist\nSende `none`, um die Nachricht zu deaktivieren\nPlaceholders: {user} - Bumper | {role} - BumpRole | {channel} - BumpChannel | {server} - Server | {category} - Category | {timestamp} - Zeit bis zum nächsten Bump',
          ephemeral: true
        })
        const msg = await collect()
        const wait = msg.first().content
        if (wait === 'none') {
          await remove(ref(db, 'bump/' + id + '/bumpWait'))
        } else {
          await set(ref(db, 'bump/' + id + '/bumpWait'), wait)
        }
        msg.first().delete()
      }
      if (interaction.values.includes('bumpChannelReady')) {
        interaction.reply({
          content: 'Bitte senden den Namen in den der Bump-Channel umbenannt werden soll, wenn der Bump bereit ist\nSende `none`, um den Namen zu deaktivieren\nPlaceholders: {role} - BumpRole | {server} - Server | {category} - Category',
          ephemeral: true
        })
        const msg = await collect()
        const channelReady = msg.first().content
        if (channelReady === 'none') {
          await remove(ref(db, 'bump/' + id + '/channelReady'))
        } else {
          await set(ref(db, 'bump/' + id + '/channelReady'), channelReady)
        }
        msg.first().delete()
      }
      if (interaction.values.includes('bumpChannelWait')) {
        interaction.reply({
          content: 'Bitte senden den Namen in den der Bump-Channel umbenannt werden soll, nachdem der Bump abgeschlossen ist und wann der nächste Bump möglich ist\nSende `none`, um den Namen zu deaktivieren\nPlaceholders: {user} - Bumper | {role} - BumpRole | {server} - Server | {category} - Category | {hour} - Stunde | {minute} - Minute',
          ephemeral: true
        })
        const msg = await collect()
        const channelWait = msg.first().content
        if (channelWait === 'none') {
          await remove(ref(db, 'bump/' + id + '/channelWait'))
        } else {
          await set(ref(db, 'bump/' + id + '/channelWait'), channelWait)
        }
        msg.first().delete()
      }
      if (interaction.values.includes('bumpThanks')) {
        interaction.reply({
          content: 'Bitte sende die Nachricht, mit welcher der Bumper bedankt wird.\nSende `none`, um die Nachricht zu deaktivieren\nPlaceholders: {user} - Bumper | {role} - BumpRole | {channel} - BumpChannel | {server} - Server | {category} - Category | {timestamp} - Bump Zeit',
          ephemeral: true
        })
        const msg = await collect()
        const thanks = msg.first().content
        if (thanks === 'none') {
          await remove(ref(db, 'bump/' + id + '/thanks'))
        } else {
          await set(ref(db, 'bump/' + id + '/thanks'), thanks)
        }
        msg.first().delete()
      }
      if (interaction.values.includes('bumpDelEmbed')) {
        interaction.reply({
          content: 'Soll das Bump Embed gelöscht werden?\n`true` - Ja\n`false` - Nein',
          ephemeral: true
        })
        const msg = await collect()
        const delEmbed = msg.first().content
        if (delEmbed === 'true') {
          await set(ref(db, 'bump/' + id + '/delEmbed'), true)
        } else {
          await remove(ref(db, 'bump/' + id + '/delEmbed'))
        }
        msg.first().delete()
      }
      interaction.editReply({
        content: 'Erfolgreich gespeichert',
        components: []
      })
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
      prev.prev.interaction.editReply({
        embeds: [bumpEmbed]
      })
    } catch {
      return null
    }
  }
}
