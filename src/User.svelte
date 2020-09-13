<script xmlns:option="http://www.w3.org/1999/xlink">
  export let reports;
  export let currentTab;
  export let user;
  export let judges;
  export let rank;

  let updated = false;

  const RANK_OPTIONS = [
    {id: undefined, text: '', rank: 0},
    {id: 'none', text: 'No Rank', rank: 1},
    {id: 'other', text: 'Other', rank: 2},
    {id: 'home-brewer', text: 'Home Brewer', rank: 10},
    // typo
    {id: 'professinal', text: 'Professional Brewer', rank: 10},
    {id: 'professional', text: 'Professional Brewer', rank: 10},
    {id: 'beer-sommelier', text: 'Beer Sommelier', rank: 15},
    {id: 'cicerone', text: 'Cicerone', rank: 20},
    {id: 'gabf-wbc', text: 'GABF/WBC', rank: 50},
    {id: 'bjcp-novice', text: `BJCP Novice`, rank: 60},
    {id: 'bjcp-apprentice', text: `BJCP Apprentice`, rank: 70},
    {id: 'bjcp-pending', text: 'BJCP Rank Pending', rank: 100},
    {id: 'bjcp-recognized', text: `BJCP Recognized`, rank: 120},
    {id: 'bjcp-certified', text: `BJCP Certified`, rank: 140},
    {id: 'bjcp-national', text: `BJCP National`, rank: 200},
    {id: 'bjcp-master', text: `BJCP Master`, rank: 250},
    {id: 'bjcp-grand-master', text: `BJCP Grand Master`, rank: 300},
  ];


  function updateUser(judge) {
    if (!judge || !updated) return;
    console.log("Judge selected: : " + judge);
    currentTab = 3;
    reports.forEach(report => {
        if (report.user.name === judge) {
          rank = report.user.rank;
          console.log("found judge rank: " + rank);
        }
      }
    );
    if (judges.you) judges.you.length = 0;
    if (judges.others) judges.others.length = 0;
    if (judges.experimented) judges.experimented.length = 0;
    reports.forEach(report => classReport(report));
    judges.experimented.sort(compareReportRank);
    judges.others.sort(compareReportRank);
    judges = judges;
    updated = false;
  }

  function classReport(report) {
    console.log("Class report from " + report.user.name + " rank " + report.user.rank);
    if (report.user.name === user) {
      console.log("add report for you " + report.user.name + " rank " + report.user.rank);
      judges.you.push(report);
      report.cat = 'you';
    } else if (compareRank(report.user.rank, rank) > 0) {
      console.log("exp " + report.user.rank);
      judges.experimented.push(report);
      report.cat = 'expert';
    } else {
      console.log("other " + report.user.rank);
      judges.others.push(report);
      report.cat = 'other';
    }
  }

  function getRank(name) {
    for (let i = 0; i < RANK_OPTIONS.length; i++) {
      if (RANK_OPTIONS[i].id === name)
        return RANK_OPTIONS[i].rank;
    }
  }

  function getRankName(name) {
    for (let i = 0; i < RANK_OPTIONS.length; i++) {
      if (RANK_OPTIONS[i].id === name)
        return RANK_OPTIONS[i].text;
    }
  }

  function compareRank(rankA, rankB) {
    return getRank(rankA) > getRank(rankB);
  }

  function compareReportRank(a, b) {
    return getRank(b.user.rank) - getRank(a.user.rank);
  }

  $: updateUser(user);

</script>
<style>
    table {
        margin: 1em;
    }

    th {
        text-align: left;
        padding-top: 10px;
    }

    td {
        padding-right: 1em;
    }

    td.score {
        text-align: right;
    }
</style>

<label>Select a Judge:
  <select bind:value={user} on:change={() => updated=true}>
    <option value="">...</option>
    {#each reports as item}
      <option value={item.user.name}>
        {item.user.name} ({item.user.rank}) {item.score}
      </option>
    {/each}
  </select>
</label>


{#if user}
  <table>
    <tr>
      <th>Name</th>
      <th>Rank</th>
      <th>Score</th>
    </tr>
    {#if judges.experimented.length > 0}
      <tr>
        <th colspan="3">More Experimented  ({judges.experimented.length})</th>
      </tr>
      {#each judges.experimented as item}
        <tr>
          <td>{item.user.name}</td>
          <td>{getRankName(item.user.rank)}</td>
          <td class="score">{item.score}</td>
        </tr>
      {/each}
    {/if}
    <tr>
      <th colspan="3">You</th>
    </tr>
    {#each judges.you as item}
      <tr>
        <td>{item.user.name}</td>
        <td>{getRankName(item.user.rank)}</td>
        <td class="score">{item.score}</td>
      </tr>
    {/each}
    {#if judges.others.length > 0}
      <tr>
        <th colspan="3">Others ({judges.others.length})</th>
      </tr>
      {#each judges.others as item}
        <tr>
          <td>{item.user.name}</td>
          <td>{getRankName(item.user.rank)}</td>
          <td class="score">{item.score}</td>
        </tr>
      {/each}
    {/if}
  </table>
{/if}

