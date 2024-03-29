/**
 * @file Sample button interaction

 * @since 2.0.0
*/
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')
const { set, ref, getDatabase } = require('firebase/database')
module.exports = {
  id: 'vorschlag_anonym',

  /**
   * @description Executes when the modal with ID "vorschlag_anonym" is called.

   * @param {Object} interaction The Interaction Object of the command.
   */

  async execute (interaction) {
    const titel = interaction.fields.getTextInputValue('titel')
    const beschreibung = interaction.fields.getTextInputValue('beschreibung')
    if (titel === '' || beschreibung === '') {
      return interaction.reply({
        content: '**Vorschlag unvollständig!**',
        ephemeral: true
      })
    }
    const embed = new EmbedBuilder()
      .setTitle(titel)
      .setDescription(beschreibung)
      .setAuthor({ name: 'Vorschlag' })
    interaction.channel
      .send({
        embeds: [embed],
        components: []
      })
      .then(function (message) {
        message.react('👍')
        message.react('🤷')
        message.react('👎')
        message.startThread({
          name: `${titel}`,
          autoArchiveDuration: 1440 * 7,
          type: 'GUILD_PUBLIC_THREAD'
        }).then(function (thread) {
          const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel('Anonym antworten')
              .setCustomId('anonymantworten')
              .setStyle(ButtonStyle.Secondary)
          )
          thread
            .send({
              content: 'Drücke hier um anonym zu antworten',
              components: [row3]
            })
            .then(function (message) {
              message.pin()
            })
        })
        set(ref(getDatabase(), interaction.guild.id + '/anonym/messages/' + message.id), interaction.member.id)
      })
      .catch()
    async function run () {
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Vorschlag')
          .setCustomId('vorschlag_normal')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setLabel('Anonym')
          .setCustomId('vorschlag_anonym')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setLabel('Event')
          .setCustomId('vorschlag_event')
          .setStyle(ButtonStyle.Secondary)
      )
      const fetch = await interaction.channel.messages.fetch({
        limit: 10
      })
      const fetchfiltered = fetch.filter(function (list) {
        return list.content === 'Drücke hier um einen Vorschlag einzureichen'
      })
      const id = fetchfiltered.map(function (list) {
        return list.id
      })
      if (id.length !== 0) {
        interaction.channel.messages
          .fetch(id.toString())
          .then((message) => {
            message.delete()
          })
          .catch({})
      }
      interaction.channel.send({
        content: 'Drücke hier um einen Vorschlag einzureichen',
        components: [row1]
      })
    }
    run().then().catch()
    require('dotenv').config()
    const api = process.env.trelloApi
    const token = process.env.trelloToken
    const Trello = require('trello-node-api')(api, token)
    const data = {
      name: titel,
      desc: beschreibung,
      pos: 'top',
      idList: '62016b6b6686ac1c549a0ed6'
    }
    Trello.card
      .create(data)
      .then()
      .catch()
    interaction.reply({
      content:
        '**Vorschlag eingereicht!**\nDu kannst diese Nachricht jetzt verwerfen',
      ephemeral: true
    })
  }
}
