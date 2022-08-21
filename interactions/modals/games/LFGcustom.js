const { EmbedBuilder, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { get, ref, getDatabase } = require("firebase/database")
const moment = require("moment");

/**
 * @file Modal interaction: LFGcustom
 * @since 1.0.0
*/
module.exports = {
  id: 'LFGcustom',
  /**
* @description Executes when the modal with ID LFGcustom is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    try {
      const mapArray = Array.from(interaction.fields.fields)
      if (moment(mapArray[2][1].value, "HH:mm", true).isValid() && moment(mapArray[1][1].value, "DD.MM.YYYY", true).isValid()) {
        await interaction.deferReply({ ephemeral: true })
        const embed = new EmbedBuilder()
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
          .setTitle('Spielersuche')
          .addFields(
            { name: 'Spiel', value: mapArray[0][1].value },
            { name: 'Zeit', value: mapArray[2][1].value },
            { name: 'Tag', value: mapArray[1][1].value }
          )
          .setFooter({ text: 'Das Event kann nur vom Ersteller geschlossen werden' })
        const combinedDate = mapArray[1][1].value + ' ' + mapArray[2][1].value + ':00'
        let date = await moment(combinedDate, "DD.MM.YYYY HH:mm", 'de').toDate()
        let channel = interaction.guild.channels.cache.get(JSON.stringify(await get(ref(getDatabase(), interaction.guild.id + '/game/waitingChannel'))).slice(1, -1))
        try {
          const rowRow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('startEvent')
                .setLabel('Event starten')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅'),
              new ButtonBuilder()
                .setCustomId('deleteEvent')
                .setLabel('Event schließen')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🗑️')
            )
          let description
          if (mapArray[3][1].value) {
            description = `${interaction.member} sucht nach ${mapArray[3][1].value} Spieler(n), um ${mapArray[0][1].value} zu spielen.`
            embed.addFields(
              { name: 'Anzahl Spieler', value: mapArray[3][1].value }
            )
          } else {
            description = `${interaction.member} sucht Mitspieler, um ${mapArray[0][1].value} zu spielen.`
          }
          if (mapArray[4][1].value) {
            description += `\n**Zusätzliche Infos:**\n${mapArray[4][1].value}`
            embed.addFields(
              { name: 'Zusätzliche Infos', value: mapArray[4][1].value }
            )
          }
          await interaction.guild.scheduledEvents.create({
            name: mapArray[0][1].value.toString(),
            scheduledStartTime: date,
            channel: channel,
            description: description,
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.Voice
          }).then(async event => {
            rowRow.addComponents(
              new ButtonBuilder()
                .setURL(`https://discord.com/events/${interaction.guild.id}/${event.id}`)
                .setLabel('Event ansehen')
                .setStyle(ButtonStyle.Link)
                .setEmoji('🔗')
            )
            const role = interaction.guild.roles.cache.get(JSON.stringify(await get(ref(getDatabase(), interaction.guild.id + '/game/waitingRole'))).slice(1, -1))
            interaction.channel.send({ content: role.toString(), embeds: [embed], components: [rowRow] })
            interaction.editReply({ content: 'Event erfolgreich erstellt!' })
            async function run () {
              const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel('Looking for Group')
                  .setCustomId('lfg')
                  .setStyle(ButtonStyle.Primary)
                  .setEmoji('🎮'),
                new ButtonBuilder()
                  .setLabel('Looking for custom Game')
                  .setCustomId('lfcg')
                  .setStyle(ButtonStyle.Secondary)
                  .setEmoji('✨')
              )
              const fetch = await interaction.channel.messages.fetch({
                limit: 10
              })
              const fetchfiltered = fetch.filter(function (list) {
                return (
                  list.content === 'Drücke hier um nach einer Gruppe zu suchen'
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
                content: 'Drücke hier um nach einer Gruppe zu suchen',
                components: [row1]
              })
            }
            run()
          })
        } catch (e) {
          console.log(e)
          interaction.editReply({ content: 'Event liegt in der Vergangenheit' })
        }
      }
    } catch {
      null
    }
  }
}
