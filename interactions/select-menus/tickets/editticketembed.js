const prev = require('../../slash/tickets/createticket.js')
/**
 * @file Select menu interaction: editticketembed
 * @since 1.0.0
*/
module.exports = {
  id: 'editticketembed',
  /**
* @description Executes when the select menu with ID editticketembed is called.
* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const embed = prev.prev.ticketEmbed
    async function editEmbed (value) {
      try {
        await prev.prev.interaction.editReply({ embeds: [value] })
      } catch (error) {
        interaction.editReply({ content: 'Error editing embed.\nThere will be no element left. Consider adding another.' })
      }
    }
    await prev.prev.interaction.editReply({ components: [prev.prev.editEmbedRow, prev.prev.saveEmbedRow] })
    function collect () {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1 })
      return msg
    }
    if (interaction.values.includes('title')) {
      interaction.reply({
        content: 'Bitte gib den Titel des Tickets an.\n Schreibe `remove` um den Titel zu entfernen.',
        ephemeral: true
      })
      await collect().then(async (m) => {
        if (m.first().content.toLowerCase() !== 'remove') {
          const title = m.first().content
          interaction.editReply({
            content: 'Titel gesetzt.'
          })
          m.first().delete()
          editEmbed(embed.setTitle(title))
        } else {
          m.first().delete()
          interaction.editReply({
            content: 'Titel entfernt.'
          })
          editEmbed(embed.setTitle(null))
        }
      })
    } else if (interaction.values.includes('url')) {
      interaction.reply({
        content: 'Bitte gib die URL des Tickets an.\n Schreibe `remove` um die URL zu entfernen.',
        ephemeral: true
      })
      await collect().then(async (m) => {
        if (m.first().content.toLowerCase() !== 'remove') {
          const url = m.first().content
          interaction.editReply({
            content: 'URL gesetzt.'
          })
          m.first().delete()
          editEmbed(embed.setURL(url))
        } else {
          m.first().delete()
          interaction.editReply({
            content: 'URL entfernt.'
          })
          editEmbed(embed.setURL(null))
        }
      })
    } else if (interaction.values.includes('author')) {
      let authorName
      let authorIcon
      let authorUrl
      interaction.reply({
        content: 'Bitte gib den Autor Namen des Tickets an.\n Schreibe `remove` um den Author zu entfernen.',
        ephemeral: true
      })
      await collect().then(async (m) => {
        if (m.first().content !== 'remove') {
          authorName = m.first().content
          interaction.editReply({
            content: 'Autor Namen gesetzt.\nBitte schick ein Author Icon.\nSchreibe `none` um keinen Autor Icon zu setzen.\nSchreibe `server` um das Servericon zu verwenden.'
          })
          m.first().delete()
          await collect().then(async (m) => {
            if (!m.first().content) {
              authorIcon = m.first().attachments.first().url
            } else if (m.first().content === 'server') {
              authorIcon = interaction.guild.iconURL()
            }
            interaction.editReply({
              content: 'Authoricon gesetzt.\nBitte schick ein Author URL.\nSchreibe `none` um keinen AutorURL zu setzen.'
            })
            m.first().delete()
          })
          await collect().then(async (m) => {
            if (!m.first().content === 'none') {
              authorUrl = m.first().content
            }
            m.first().delete()
            interaction.editReply({
              content: 'Author gesetzt.'
            })
            if (authorName && authorIcon && authorUrl) {
              editEmbed(embed.setAuthor({ name: authorName, iconURL: authorIcon, url: authorUrl }))
            } else if (authorName && authorIcon) {
              editEmbed(embed.setAuthor({ name: authorName, iconURL: authorIcon }))
            } else if (authorName) {
              editEmbed(embed.setAuthor({ name: authorName }))
            }
          })
        } else {
          editEmbed(embed.setAuthor(null))
          m.first().delete()
        }
      })
    } else if (interaction.values.includes('description')) {
      interaction.reply({
        content: 'Bitte gib die Beschreibung des Tickets an.\n Schreibe `remove` um die Beschreibung zu entfernen.',
        ephemeral: true
      })
      await collect().then(async (m) => {
        if (m.first().content.toLowerCase() !== 'remove') {
          const description = m.first().content
          interaction.editReply({
            content: 'Beschreibung gesetzt.'
          })
          m.first().delete()
          editEmbed(embed.setDescription(description))
        } else {
          m.first().delete()
          interaction.editReply({
            content: 'Beschreibung entfernt.'
          })
          editEmbed(embed.setDescription(null))
        }
      })
    } else if (interaction.values.includes('thumbnail')) {
      interaction.reply({
        content: 'Bitte schick das Thumbnail des Tickets an.\n Schreibe `remove` um den Thumbnail zu entfernen.\nSchreibe `server` um das Servericon zu verwenden.',
        ephemeral: true
      })
      await collect().then(async (m) => {
        let thumbnail
        if (m.first().content.toLowerCase() === 'server') {
          thumbnail = interaction.guild.iconURL()
          interaction.editReply({
            content: 'Thumbnail gesetzt.'
          })
        } else if (m.first().content.toLowerCase() !== 'remove') {
          thumbnail = m.first().attachments.first().url
          interaction.editReply({
            content: 'Thumbnail gesetzt.'
          })
        } else {
          thumbnail = null
          interaction.editReply({
            content: 'Thumbnail entfernt.'
          })
        }
        m.first().delete()
        editEmbed(embed.setThumbnail(thumbnail))
      })
    } else if (interaction.values.includes('color')) {
      interaction.reply({
        content: 'Bitte gib die Farbe des Tickets in HEX-Code an. (https://www.google.com/search?q=hex+color)\n Schreibe `remove` um die Farbe zu entfernen.',
        ephemeral: true
      })
      await collect().then(async (m) => {
        if (m.first().content.toLowerCase() !== 'remove') {
          let color = m.first().content
          if (!color.startsWith('#')) {
            color = `#${color}`
          }
          const reg = /^#([0-9a-f]{3}){1,2}$/i
          if (reg.test(color) && color.length === 7) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
            const colorArray = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
            interaction.editReply({
              content: 'Farbe gesetzt.'
            })
            editEmbed(embed.setColor(colorArray))
          } else {
            interaction.editReply({
              content: 'Farbe nicht gesetzt.\nBitte gib eine gültige Hex-Farbe an.'
            })
          }
          m.first().delete()
        } else {
          m.first().delete()
          interaction.editReply({
            content: 'Farbe entfernt.'
          })
          editEmbed(embed.setColor(null))
        }
      })
    } else if (interaction.values.includes('image')) {
      interaction.reply({
        content: 'Bitte schick das Bild des Tickets an.\n Schreibe `remove` um den Bild zu entfernen.\nSchreibe `server` um das Servericon zu verwenden.',
        ephemeral: true
      })
      await collect().then(async (m) => {
        let thumbnail
        if (m.first().content.toLowerCase() === 'server') {
          thumbnail = interaction.guild.iconURL()
          interaction.editReply({
            content: 'Bild gesetzt.'
          })
        } else if (m.first().content.toLowerCase() !== 'remove') {
          thumbnail = m.first().attachments.first().url
          interaction.editReply({
            content: 'Bild gesetzt.'
          })
        } else {
          thumbnail = null
          interaction.editReply({
            content: 'Bild entfernt.'
          })
        }
        m.first().delete()
        editEmbed(embed.setImage(thumbnail))
      })
    } else if (interaction.values.includes('footer')) {
      let footerName, footerIcon
      interaction.reply({
        content: 'Bitte gib den Footer Namen des Tickets an.\n Schreibe `remove` um den Author zu entfernen.',
        ephemeral: true
      })
      await collect().then(async (m) => {
        if (m.first().content !== 'remove') {
          footerName = m.first().content
          interaction.editReply({
            content: 'Footer Namen gesetzt.\nBitte schick ein Footer Icon.\nSchreibe `none` um keinen Autor Icon zu setzen.\nSchreibe `server` um das Servericon zu verwenden.'
          })
          m.first().delete()
          await collect().then(async (m) => {
            if (!m.first().content) {
              footerIcon = m.first().attachments.first().url
            } else if (m.first().content === 'server') {
              footerIcon = interaction.guild.iconURL()
            }
            interaction.editReply({
              content: 'Footer Icon gesetzt.'
            })
            m.first().delete()
          })
          if (footerName && footerIcon) {
            editEmbed(embed.setFooter({ name: footerName, iconURL: footerIcon }))
          } else if (footerName) {
            editEmbed(embed.setAuthor({ name: footerName }))
          }
        } else {
          editEmbed(embed.setAuthor(null))
          m.first().delete()
        }
      })
    }
  }
}
