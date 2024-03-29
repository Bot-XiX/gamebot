/**
 * @file Sample button interaction
 * @since 1.0.0
*/
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')
const { getDatabase, ref, set } = require('firebase/database')
module.exports = {
  id: 'anonymerKummerkasten',

  /**
   * @description Executes when the modal with ID "anonyme_frage" is called.

   * @param {Object} interaction The Interaction Object of the command.
   */

  async execute (interaction) {
    const titel = interaction.fields.getTextInputValue('titel')
    const beschreibung = interaction.fields.getTextInputValue('beschreibung')
    const embed = new EmbedBuilder()
      .setTitle(titel)
      .setDescription(beschreibung)
      .setColor('DARK_AQUA')
    interaction.channel
      .send({
        content:
          '*Schau in die angepinnten Nachrichten oder an den Anfang des Threads um anonym zu antworten!*',
        embeds: [embed],
        components: []
      })
      .then(function (message) {
        async function run () {
          const thread = await message.startThread({
            name: `${titel}`,
            autoArchiveDuration: 1440 * 7,
            type: 'GUILD_PUBLIC_THREAD'
          })
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
        }
        run()
        set(ref(getDatabase(), interaction.guild.id + '/anonym/messages/' + message.id), interaction.member.id)
      })
      .catch()
    async function run () {
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Post')
          .setCustomId('anonymerKummerkasten')
          .setStyle(ButtonStyle.Primary)
      )
      const fetch = await interaction.channel.messages.fetch({
        limit: 10
      })
      const fetchfiltered = fetch.filter(function (list) {
        return (
          list.content === 'Drücke hier um anonym einen Post zu erstellen'
        )
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
        content: 'Drücke hier um anonym einen Post zu erstellen',
        components: [row1]
      })
    }
    run().then().catch()
    interaction.reply({
      content:
        '**Post eingereicht!**\nDu kannst diese Nachricht jetzt verwerfen',
      ephemeral: true
    })
    interaction.deleteReply()
  }
}
