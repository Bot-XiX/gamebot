const { ButtonBuilder } = require('@discordjs/builders')
const { EmbedBuilder, ActionRowBuilder } = require('discord.js')
const { set, ref, getDatabase } = require('firebase/database')
/**
 * @file Select menu interaction: editTicket
 * @since 1.0.0
*/
module.exports = {
  id: 'editTicket',
  /**
* @description Executes when the select menu with ID editTicket is called.
* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    async function editEmbed (value) {
      try {
        await interaction.message.edit({ embeds: [value] })
      } catch (error) {
        interaction.editReply({ content: 'Error editing embed.\nThere will be no element left. Consider adding another.' })
      }
    }
    function collect () {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1 })
      return msg
    }
    await interaction.deferReply({ ephemeral: true })
    try {
      const client = interaction.client
      const embed = EmbedBuilder.from(interaction.message.embeds[0])

      if (interaction.values.includes('title')) {
        interaction.editReply({
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
        interaction.editReply({
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
        interaction.editReply({
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
        interaction.editReply({
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
        interaction.editReply({
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
        interaction.editReply({
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
        interaction.editReply({
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
        interaction.editReply({
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
              editEmbed(embed.setFooter({ text: footerName, iconURL: footerIcon }))
            } else if (footerName) {
              editEmbed(embed.setAuthor({ text: footerName }))
            }
          } else {
            editEmbed(embed.setAuthor(null))
            m.first().delete()
          }
        })
      } else if (interaction.values.includes('addButton')) {
        const button = new ButtonBuilder()
        let length
        try {
          length = interaction.message.components[2].components.length
        } catch {
          length = 0
        }
        if (length > 4) {
          interaction.editReply({
            content: 'Maximal 5 Buttons sind möglich.'
          })
        } else {
          interaction.editReply({
            content: 'Bitte gib den Text des Buttons an.',
            ephemeral: true
          })
          await collect().then(async (m) => {
            button.setLabel(m.first().content)
            interaction.editReply({
              content: 'Button Text gesetzt.\nBitte gib den Style des Buttons an.\n*(Possible Styles: primary, secondary, success, danger)*'
            })
            m.first().delete()
            await collect().then(async (m) => {
              if (m.first().content.toLowerCase() === 'primary') {
                button.setStyle('Primary')
              } else if (m.first().content.toLowerCase() === 'secondary') {
                button.setStyle('Secondary')
              } else if (m.first().content.toLowerCase() === 'success') {
                button.setStyle('Success')
              } else if (m.first().content.toLowerCase() === 'danger') {
                button.setStyle('Danger')
              } else {
                button.setStyle('Primary')
              }
              interaction.editReply({
                content: 'Button Style gesetzt.\nBitte gib den Emoji des Buttons an.\n Schreibe `none` um keinen Emoji zu setzen.'
              })
              m.first().delete()
              await collect().then(async (m) => {
                if (m.first().content !== 'none') {
                  const emoji = client.emojis.cache.get(m.first().content.split(':')[2].slice(0, -1))
                  try {
                    button.setEmoji({ id: emoji.id })
                    interaction.editReply({
                      content: `Button Emoji gesetzt: ${emoji}}\nBitte erwähne die Moderationsrollen bzw. User.`
                    })
                  } catch (e) {
                    interaction.editReply({
                      content: 'Button Emoji nicht gesetzt.\nKein Zugriff auf diesen Emoji oder Emoji ist animiert.\nBitte erwähne die Moderationsrollen bzw. User.'
                    })
                  }
                } else {
                  interaction.editReply({
                    content: 'Kein Emoji gesetzt.\nBitte erwähne die Moderationsrollen bzw. User.'
                  })
                }
                m.first().delete()
              })
              let row
              try {
                row = ActionRowBuilder.from(interaction.message.components[2])
                button.setCustomId('ticket' + length)
              } catch {
                row = new ActionRowBuilder()
                button.setCustomId('ticket0')
              }
              row.addComponents(button)
              interaction.message.edit({ components: [interaction.message.components[0], interaction.message.components[1], row] })
              const db = getDatabase()
              const id = interaction.guild.id
              await collect().then(async (m) => {
                // Get mod users and roles
                const modUsers = m.first().mentions.users.map((user) => user.id)
                const modRoles = m.first().mentions.roles.map((role) => role.id)
                const modIDs = [...modUsers, ...modRoles]
                const modNames = m.first().mentions.users.map((user) => user.tag).join(', ') + m.first().mentions.roles.map((role) => role.name).join(', ')
                set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modRoles'), modIDs)
                interaction.editReply({
                  content: `Moderationsrollen gesetzt: ${modNames}\nBitte schreibe die Kategorie-ID für offene Tickets.`
                })
                m.first().delete()
                await collect().then(async (m) => {
                  const channel = interaction.guild.channels.cache.get(m.first().content)
                  set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/channel'), channel.id)
                  interaction.editReply({
                    content: `Channel gesetzt: ${channel}\nBitte schreibe die Kategorie-ID für geschlossene Tickets.`
                  })
                  m.first().delete()
                  await collect().then(async (m) => {
                    const channel = interaction.guild.channels.cache.get(m.first().content)
                    set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/closedChannel'), channel.id)
                    interaction.editReply({
                      content: `Channel gesetzt: ${channel}\nBitte schreibe die Kategorie-ID für Ticket-Archiv.`
                    })
                    m.first().delete()
                    await collect().then(async (m) => {
                      const channel = interaction.guild.channels.cache.get(m.first().content)
                      set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/archiveChannel'), channel.id)
                      interaction.editReply({
                        content: `Channel gesetzt: ${channel}\nBitte schreibe den Namen des Tickets.`
                      })
                      m.first().delete()
                      await collect().then(async (m) => {
                        set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/name'), m.first().content)
                        interaction.editReply({
                          content: `Name gesetzt: ${m.first().content}`
                        })
                        m.first().delete()
                        await collect().then(async (m) => {
                          if (m.first().content.toLowerCase() !== 'none') {
                            let channelID
                            if (m.first().mentions.channels.first()) {
                              channelID = m.first().mentions.channels.first().id
                            } else {
                              channelID = m.first().content
                            }
                            set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/transcriptChannel'), channelID)
                            interaction.editReply({
                              content: `Transcript Channel gesetzt: ${interaction.guild.channels.cache.get(channelID)}\nMöchtest du Modals für dieses Ticket erstellen?\nSchreibe \`yes\` oder \`no\`.`
                            })
                          } else {
                            interaction.editReply({
                              content: `Kein Transcript Channel gesetzt.\nMöchtest du Modals für dieses Ticket erstellen?\nSchreibe \`yes\` oder \`no\`.`
                            })
                          }
                          m.first().delete()
                          await collect().then(async (m) => {
                            if (m.first().content.toLowerCase() === 'yes') {
                              set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modals/enabled'), true)
                              m.first().delete()
                              interaction.editReply({
                                content: 'Modals aktiviert.\nBitte schreibe den Titel des Modals.'
                              })
                            } else {
                              set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modals/enabled'), false)
                              m.first().delete()
                              return interaction.editReply({
                                content: 'Modals deaktiviert.\nFertig.'
                              })
                            }
                            await collect().then(async (m) => {
                              const title = m.first().content
                              set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modals/title'), title)
                              interaction.editReply({
                                content: `Titel gesetzt: ${title}\nBitte schreibe die Anzahl der Modal-Komponenten.`
                              })
                              m.first().delete()
                              await collect().then(async (m) => {
                                const amount = parseInt(m.first().content)
                                if (isNaN(amount)) {
                                  set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modals/enabled'), false)
                                  m.first().delete()
                                  return interaction.editReply({
                                    content: 'Keine Zahl eingegeben.\nFertig.'
                                  })
                                }
                                m.first().delete()
                                set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modals/amount'), amount)
                                for (let i = 0; i < amount; i++) {
                                  interaction.editReply({
                                    content: 'Bitte schreibe die Namen der Modal-Komponente.'
                                  })
                                  await collect().then(async (m) => {
                                    const name = m.first().content
                                    interaction.editReply({
                                      content: `Name gesetzt: ${name}\nBitte schreibe den Placeholder der Modal-Komponente.`
                                    })
                                    m.first().delete()
                                    set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modals/' + i + '/name'), name)
                                    await collect().then(async (m) => {
                                      const placeholder = m.first().content
                                      interaction.editReply({
                                        content: `Placeholder gesetzt: ${placeholder}\nBitte schreibe gib an ob es sich um eine kurze oder lange Eingabe handelt.\nSchreibe \`short\` oder \`long\`.`
                                      })
                                      set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modals/' + i + '/placeholder'), placeholder)
                                      m.first().delete()
                                      await collect().then(async (m) => {
                                        if (m.first().content.toLowerCase() === 'short') {
                                          set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modals/' + i + '/type'), '1')
                                        } else {
                                          set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modals/' + i + '/type'), '2')
                                        }
                                        interaction.editReply({
                                          content: `Typ gesetzt: ${m.first().content}\nIst dieses Feld required?\nSchreibe \`yes\` oder \`no\`.`
                                        })
                                        m.first().delete()
                                        await collect().then(async (m) => {
                                          if (m.first().content.toLowerCase() === 'yes') {
                                            set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modals/' + i + '/required'), true)
                                          } else {
                                            set(ref(db, id + '/tickets/config/' + interaction.message.id + '/buttons/components/' + length + '/modals/' + i + '/required'), false)
                                          }
                                          interaction.editReply({
                                            content: `Required gesetzt: ${m.first().content}\nFertig.`
                                          })
                                          m.first().delete()
                                        })
                                      })
                                    })
                                  })
                                }
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        }
      }
    } catch (e) {
      interaction.editReply({
        content: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
      })
    }
  }
}
