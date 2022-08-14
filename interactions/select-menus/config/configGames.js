const { SelectMenuBuilder, ActionRowBuilder } = require("discord.js")
const { set, ref, getDatabase, remove, push, onValue } = require("firebase/database")
const prev = require('./config')

/**
 * @file Select menu interaction: configGames
 * @since 1.0.0
*/
module.exports = {
  id: 'configGames',
  /**
* @description Executes when the select menu with ID configGames is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    function collect () {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1 })
      return msg
    }
    try {
      console.log(prev)
      prev.prev.interaction.editReply({
        components: [interaction.message.components[0]]
      })
      const db = getDatabase()
      const id = interaction.guild.id
      if (interaction.values.includes('addGame')) {
        interaction.reply({
          content: 'Bitte sende den Spielnamen',
          ephemeral: true
        })
        const msg = await collect()
        const gameName = msg.first().content
        interaction.editReply({
          content: 'Bitte sende das Spiel-Logo als Bild oder Link!\n Schreibe `none` um kein Logo zu setzen.'
        })
        msg.first().delete()
        const msg2 = await collect()
        if (msg2.first().content !== 'none') {
          try {
            let gameLogo
            if (msg2.first().attachments.size > 0) {
              gameLogo = msg2.first().attachments.first().url
            } else {
              gameLogo = msg2.first().content
            }
            await set(ref(db, id + '/games/' + gameName.toLowerCase() + '/logo'), gameLogo)
          } catch {
            null
          }
          interaction.editReply({
            content: 'Fertig!'
          })
        } else {
          interaction.editReply({
            content: 'Fertig!'
          })
        }
        set(ref(db, id + '/games/' + gameName.toLowerCase() + '/name'), gameName)
        msg2.first().delete()
      } else {
        remove(ref(db, id + '/games/' + interaction.values[0]))
        interaction.reply({ content: 'Spiel gelöscht!', ephemeral: true })
      }
      const games = await ref(db, id + '/games')
      const gameSelectMenu = new SelectMenuBuilder()
        .setCustomId('configGames')
        .setPlaceholder('Nothing selected')
      const unsub = onValue(games, async (snapshot) => {
        const games = snapshot.val()
        try {
          gameSelectMenu.addOptions([{ label: 'Spiel hinzufügen', value: 'addGame' }])
          for (const game in games) {
            gameSelectMenu.addOptions([{ label: games[game].name, value: game }])
          }
          const row = new ActionRowBuilder().addComponents(gameSelectMenu)
          prev.prev.interaction.editReply({
            components: [row]

          })
          unsub()
        } catch (e) {
          console.log(e)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}