/* On-demand charts of complete simulation outputs. This module does not run the model. */
((scope) => {
  "use strict";

  const CATALOG = Object.freeze(
    [
      { id: "commute-distribution", title: "Commute duration", group: "Transport", scope: "current" },
      { id: "resource-distribution", title: "Resources after housing and mobility", group: "Residents", scope: "current" },
      { id: "enterprise-size", title: "Employer size", group: "Firms", scope: "current" },
      { id: "vehicle-access", title: "Vehicle-access stock", group: "Transport", scope: "cumulative" },
      { id: "district-tradeoff", title: "District rent and commute", group: "Districts", scope: "current" },
      { id: "resident-transitions", title: "Resident state transitions", group: "Residents", scope: "retained-window" },
      { id: "labor-composition", title: "Labor-force composition", group: "Residents", scope: "current" },
      { id: "outcome-comparison", title: "Scenario and reference outcomes", group: "Overview", scope: "current" },
      { id: "district-commutes", title: "Commute differences between districts", group: "Districts", scope: "current" },
      { id: "district-housing", title: "Housing differences between districts", group: "Districts", scope: "current" },
      { id: "network-coverage", title: "Road assignment coverage", group: "Transport", scope: "current" },
      { id: "district-population-history", title: "Residents and housing capacity", group: "District", scope: "district", timeline: true },
      { id: "district-rent-history", title: "Residential rent", group: "District", scope: "district", timeline: true },
      { id: "district-employment-history", title: "Employed residents and local jobs", group: "District", scope: "district", timeline: true },
      { id: "district-work-destinations", title: "Where residents work", group: "District", scope: "district" },
      { id: "district-resident-states", title: "Resident states", group: "District", scope: "district" },
      { id: "district-travel-modes", title: "Resident travel modes", group: "District", scope: "district" },
      { id: "district-enterprise-states", title: "Employer states", group: "District", scope: "district" },
      { id: "district-commute-destinations", title: "Commute duration by workplace", group: "District", scope: "district" },
    ].map(Object.freeze)
  );
  const DEFAULT_PALETTE = Object.freeze({
    green: "#32765b",
    blue: "#527a9c",
    amber: "#b88c42",
    red: "#af6255",
    sand: "#c3b69c",
    teal: "#5c9186",
    ink: "#233330",
    muted: "#687770",
    line: "#dbe3de",
    greenSoft: "#aec7b7",
  });
  const STATES = ["Happy", "Waiting", "Extreme", "Recovery"];
  const STATE_LABELS = ["Within thresholds", "Under pressure", "Severe stress", "Recovering"];
  const finite = (value) => typeof value === "number" && Number.isFinite(value);
  const nonnegative = (value) => finite(value) && value >= 0;
  const format = (value) => new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(value);
  const cityOf = (snapshot) => snapshot?.city || null;
  const dateOf = (snapshot) => (typeof snapshot?.clock?.date === "string" ? snapshot.clock.date : null);
  const dated = (snapshot) => (dateOf(snapshot) ? `As of ${dateOf(snapshot)}` : "Current snapshot");
  const assignmentDate = (snapshot) => snapshot?.city?.networkAssignmentDate || null;

  function baseOption(palette) {
    return {
      animationDuration: 220,
      animationDurationUpdate: 0,
      color: [palette.green, palette.blue, palette.amber, palette.red, palette.sand, palette.teal],
      textStyle: { fontFamily: 'Inter, "Helvetica Neue", sans-serif', color: palette.ink, fontSize: 11 },
      tooltip: { trigger: "axis", renderMode: "richText", confine: true, backgroundColor: "#fff", borderColor: palette.line },
      legend: { top: 0, right: 4, textStyle: { color: palette.muted, fontSize: 10 } },
      grid: { top: 34, left: 48, right: 18, bottom: 64 },
      xAxis: { type: "category", axisTick: { show: false }, axisLine: { lineStyle: { color: palette.line } }, axisLabel: { color: palette.muted } },
      yAxis: { type: "value", axisLabel: { color: palette.muted }, splitLine: { lineStyle: { color: "#e8ece9" } } },
      series: [],
    };
  }

  function emptyResult(definition, palette, note) {
    const option = baseOption(palette);
    option.title = {
      text: "No recorded observations",
      left: "center",
      top: "40%",
      textStyle: { color: palette.muted, fontSize: 12, fontWeight: 400 },
    };
    option.xAxis.show = false;
    option.yAxis.show = false;
    option.legend.show = false;
    return { ...definition, subtitle: "Data unavailable", note, summary: `${definition.title}. ${note}`, empty: true, option };
  }

  function result(definition, option, subtitle, note, summary) {
    return { ...definition, subtitle, note, summary: `${definition.title}. ${summary}`, empty: false, option };
  }

  function referenceStatus(context) {
    if (!context.compare) return { available: false, note: "" };
    if (!context.referenceSnapshot) return { available: false, note: "Reference snapshot is unavailable." };
    const date = dateOf(context.snapshot);
    const referenceDate = dateOf(context.referenceSnapshot);
    const day = context.snapshot?.clock?.day;
    const referenceDay = context.referenceSnapshot?.clock?.day;
    const matched = date && referenceDate ? date === referenceDate : finite(day) && finite(referenceDay) && day === referenceDay;
    return matched ? { available: true, note: "" } : { available: false, note: "Reference omitted because its snapshot date does not match." };
  }

  function binKey(bin) {
    if (!(bin.minInclusive === null || finite(bin.minInclusive)) || !(bin.maxExclusive === null || finite(bin.maxExclusive))) return null;
    return JSON.stringify([bin.minInclusive, bin.maxExclusive]);
  }

  function distributionChart(definition, context, palette, kind) {
    const distribution = cityOf(context.snapshot)?.distributions?.[kind];
    const firm = kind === "firmSize";
    const financialStatus = kind === "financialStatus";
    const keyOf = financialStatus ? (bin) => (typeof bin.id === "string" && bin.id ? bin.id : null) : binKey;
    const totalKey = firm ? "enterpriseTotal" : "representedTotal";
    const countKey = firm ? "enterpriseCount" : "representedCount";
    const total = distribution?.[totalKey];
    const bins = Array.isArray(distribution?.bins) ? distribution.bins : [];
    if (!finite(total) || total <= 0 || !bins.length) {
      return emptyResult(
        definition,
        palette,
        kind === "commute" ? "No completed-commuter distribution is available." : "No complete population distribution is available."
      );
    }
    const percentages = bins.map((bin) => (nonnegative(bin[countKey]) ? (bin[countKey] / total) * 100 : null));
    if (!percentages.some(finite)) return emptyResult(definition, palette, "The distribution has no recorded bin counts.");
    const option = baseOption(palette);
    const financialLabels = {
      "outside-labor-force": "Outside labor force",
      unemployed: "Active job seeker",
      "fixed-cost-deficit": "Housing + mobility gap",
      "essentials-gap": "Essentials gap",
      "thin-positive-buffer": "Thin buffer",
      "savings-capacity": "Savings capacity",
    };
    const labels = bins.map((bin) =>
      financialStatus
        ? financialLabels[bin.id] || String(bin.label || bin.id)
        : firm
          ? String(bin.label).replace(/workers?/g, "worker cohorts")
          : String(bin.label)
    );
    option.xAxis.data = labels;
    option.xAxis.axisLabel = { ...option.xAxis.axisLabel, interval: 0, rotate: kind === "income" ? 20 : financialStatus ? 18 : 12 };
    if (firm) {
      option.xAxis.axisLabel = { ...option.xAxis.axisLabel, rotate: 0, formatter: (label) => label.replace(/ worker cohorts$/, "") };
      option.xAxis.name = "Staffed worker cohorts per employer";
      option.xAxis.nameLocation = "middle";
      option.xAxis.nameGap = 32;
    }
    if (financialStatus) {
      const shortLabels = {
        "Outside labor force": "Outside labor\nforce",
        "Active job seeker": "Active job\nseeker",
        "Housing + mobility gap": "Housing +\nmobility gap",
        "Essentials gap": "Essentials\ngap",
        "Thin buffer": "Thin\nbuffer",
        "Savings capacity": "Savings\ncapacity",
      };
      option.xAxis.axisLabel = {
        ...option.xAxis.axisLabel,
        rotate: 0,
        fontSize: 10,
        formatter: (label) => shortLabels[label] || label,
      };
    }
    option.yAxis = { ...option.yAxis, min: 0, max: 100, axisLabel: { formatter: "{value}%" } };
    option.series = [{ name: "Scenario", type: "bar", data: percentages, barMaxWidth: 30, itemStyle: { color: palette.green } }];
    let reference = referenceStatus(context);
    if (
      kind === "commute" &&
      reference.available &&
      assignmentDate(context.snapshot) &&
      assignmentDate(context.referenceSnapshot) &&
      assignmentDate(context.snapshot) !== assignmentDate(context.referenceSnapshot)
    ) {
      reference = { available: false, note: "Reference omitted because its travel assignment date does not match." };
    }
    const notes = [];
    const plotted = [{ name: "Scenario", counts: bins.map((bin) => (nonnegative(bin[countKey]) ? bin[countKey] : null)), total, percentages }];
    if (reference.note) notes.push(reference.note);
    if (reference.available) {
      const referenceDistribution = cityOf(context.referenceSnapshot)?.distributions?.[kind];
      const referenceTotal = referenceDistribution?.[totalKey];
      const referenceBins = new Map((referenceDistribution?.bins || []).map((bin) => [keyOf(bin), bin]));
      const values = bins.map((bin) => {
        const key = keyOf(bin);
        const match = key === null ? null : referenceBins.get(key);
        return finite(referenceTotal) && referenceTotal > 0 && match && nonnegative(match[countKey])
          ? (match[countKey] / referenceTotal) * 100
          : null;
      });
      if (values.some(finite)) {
        option.series.push({ name: "Reference", type: "bar", data: values, barMaxWidth: 30, itemStyle: { color: palette.greenSoft } });
        plotted.push({
          name: "Reference",
          counts: bins.map((bin, index) => (values[index] === null ? null : referenceBins.get(keyOf(bin))[countKey])),
          total: referenceTotal,
          percentages: values,
        });
      }
      if (values.some((value) => value === null))
        notes.push(
          financialStatus
            ? "Reference categories without matching ids or counts are missing, not zero."
            : "Reference bins without matching boundaries or counts are missing, not zero."
        );
    }
    let subtitle;
    if (kind === "commute") {
      subtitle = `${format(total)} represented completed commuters · round-trip minutes`;
      const assignment = assignmentDate(context.snapshot);
      notes.unshift(assignment ? `Travel assignment: ${assignment}.` : "Assignment date unavailable.");
      notes.push(
        "Car, transit and walk commuters only; unserved demand and noncommuters are excluded. A weekend snapshot can retain the last workday assignment."
      );
    } else if (kind === "income") {
      subtitle = `${format(total)} represented residents · AED per accounting period, before essentials`;
      notes.unshift(
        "Accrued salary + fixed support − housing − commuting − vehicle access. This is a resident budget, not an employed-worker salary distribution."
      );
      notes.push(
        "Continuing cohorts use settled accounts; opening and replacement cohorts use opening estimates. Partial opening periods are prorated."
      );
    } else if (financialStatus) {
      subtitle = `All districts · ${format(total)} represented residents · latest accounts and opening estimates`;
      notes.unshift(
        "Housing + mobility includes housing, actual commuting and vehicle-access costs. Labor-force and job-seeker categories take priority over budget categories, so these groups are not an all-resident measure of financial shortfall."
      );
      notes.push(
        "Groups use labor-force and employment activity during the accounting period. Continuing cohorts use their latest settled accounts; opening and replacement cohorts use opening estimates. Partial opening periods are prorated."
      );
    } else {
      subtitle = `${format(total)} synthetic employers · staffed worker cohorts per employer`;
      const weight = cityOf(context.snapshot)?.citizenWeight;
      notes.unshift(
        finite(weight)
          ? `Each worker cohort represents ${format(weight)} people; employers are model agents, not observed establishment counts.`
          : "Employer counts are synthetic agents, not observed establishments."
      );
    }
    const missing = percentages.filter((value) => value === null).length;
    if (missing) notes.push(`${missing} scenario bins have missing counts.`);
    const maximumShare = Math.max(...plotted.flatMap((series) => series.percentages.filter(finite)));
    option.yAxis.max = Math.min(100, Math.max(10, Math.ceil(maximumShare / 10) * 10));
    // Counts are part of rendered data so unchanged shares cannot preserve a
    // cached tooltip closure with the previous observation's denominator.
    option.series.forEach((series, index) => {
      const observation = plotted[index];
      series.data = observation.percentages.map((value, binIndex) => ({
        value,
        observedCount: observation.counts[binIndex],
        populationTotal: observation.total,
      }));
    });
    const countUnit = firm ? "synthetic employers" : kind === "commute" ? "represented completed commuters" : "represented residents";
    option.tooltip.formatter = (rows) => {
      const entries = Array.isArray(rows) ? rows : [rows];
      const index = entries[0]?.dataIndex;
      if (!Number.isInteger(index) || !bins[index]) return "";
      const visible = new Set(entries.map((entry) => entry.seriesName));
      return [
        labels[index],
        ...plotted
          .filter((series) => visible.has(series.name))
          .map((series) =>
            series.percentages[index] === null
              ? `${series.name}: unavailable`
              : `${series.name}: ${format(series.percentages[index])}% (${format(series.counts[index])} / ${format(series.total)} ${countUnit})`
          ),
      ].join("\n");
    };
    const summary = bins
      .map(
        (bin, index) =>
          `${labels[index]}: ${plotted
            .map((series) => `${series.name} ${series.percentages[index] === null ? "unavailable" : `${format(series.percentages[index])}%`}`)
            .join(", ")}`
      )
      .join("; ");
    return result(definition, option, subtitle, notes.join(" "), `${dated(context.snapshot)}. ${summary}.`);
  }

  function vehicleAccessChart(definition, context, palette) {
    const account = cityOf(context.snapshot)?.carAccessAccounting;
    const fields = ["initialAgentCount", "acquisitions", "disposals", "replacementExits", "currentAgentCount"];
    if (!account || fields.some((field) => !nonnegative(account[field])))
      return emptyResult(definition, palette, "Complete vehicle-access stock counters are unavailable.");
    const { initialAgentCount: initial, acquisitions, disposals, replacementExits, currentAgentCount: current } = account;
    if (Math.abs(initial + acquisitions - disposals - replacementExits - current) > 1e-7) {
      return emptyResult(definition, palette, "Vehicle-access counters do not reconcile; the stock bridge cannot be drawn.");
    }
    const changes = [initial, acquisitions, -disposals, -replacementExits, current];
    const bases = [0, initial, initial + acquisitions - disposals, current, 0];
    const labels = ["Initial assignment", "Acquisitions", "Financial disposals", "Replacement exits", "Current access"];
    const option = baseOption(palette);
    option.legend.show = false;
    option.xAxis.data = labels;
    option.xAxis.axisLabel = { ...option.xAxis.axisLabel, interval: 0, rotate: 12 };
    option.yAxis.name = "Resident cohorts";
    option.series = [
      {
        name: "Offset",
        type: "bar",
        stack: "stock",
        data: bases,
        silent: true,
        tooltip: { show: false },
        itemStyle: { color: "transparent" },
        emphasis: { disabled: true },
      },
      {
        name: "Access",
        type: "bar",
        stack: "stock",
        barMaxWidth: 45,
        data: changes.map((value, index) => ({
          value: Math.abs(value),
          signedValue: value,
          itemStyle: { color: index === 4 ? palette.blue : value < 0 ? palette.red : palette.green },
        })),
      },
    ];
    option.tooltip.formatter = (rows) => {
      const row = (Array.isArray(rows) ? rows : [rows]).find((entry) => entry.seriesName === "Access");
      return row ? `${labels[row.dataIndex]}\n${format(changes[row.dataIndex])} resident cohorts` : "";
    };
    return result(
      definition,
      option,
      "Cumulative stock reconciliation · resident cohorts with access",
      "Initial assignment precedes opening financial disposals. Replacement exits are separate from financial cancellation. Counts describe access-holding resident cohorts, not individual vehicles or unique purchases.",
      `${dated(context.snapshot)}. ${format(initial)} initially + ${format(acquisitions)} acquisitions − ${format(
        disposals
      )} financial disposals − ${format(replacementExits)} replacement exits = ${format(current)} current cohorts with access.`
    );
  }

  function districtChart(definition, context, palette) {
    const zones = Array.isArray(context.snapshot?.zones) ? context.snapshot.zones : [];
    const data = zones.flatMap((zone) => {
      const completedCounts = [zone.modeCounts?.car, zone.modeCounts?.pt, zone.modeCounts?.walk];
      const completed = completedCounts.every(nonnegative) ? completedCounts.reduce((sum, value) => sum + value, 0) : null;
      if (
        !nonnegative(zone.residentialRentAed) ||
        !nonnegative(zone.averageRoundTripMinutes) ||
        !finite(zone.representedPopulation) ||
        zone.representedPopulation <= 0 ||
        !(completed > 0)
      )
        return [];
      return [
        {
          name: String(zone.name || zone.id),
          zoneId: String(zone.id),
          value: [zone.residentialRentAed, zone.averageRoundTripMinutes, zone.representedPopulation],
          label: { show: String(zone.id) === String(context.selectedZoneId), formatter: String(zone.name || zone.id), position: "top" },
          itemStyle: {
            color: String(zone.id) === String(context.selectedZoneId) ? palette.blue : palette.green,
            opacity: 0.8,
            borderColor: palette.ink,
            borderWidth: String(zone.id) === String(context.selectedZoneId) ? 2 : 0,
          },
        },
      ];
    });
    if (!data.length) return emptyResult(definition, palette, "No district has complete rent, population and completed-commuter observations.");
    const maximumPopulation = Math.max(...data.map((point) => point.value[2]));
    const option = baseOption(palette);
    option.legend.show = false;
    option.grid = { top: 30, left: 58, right: 30, bottom: 56 };
    option.xAxis = { ...option.xAxis, type: "value", name: "Monthly residential rent (AED)", nameLocation: "middle", nameGap: 34 };
    option.yAxis = { ...option.yAxis, name: "Round-trip minutes" };
    option.tooltip.trigger = "item";
    option.tooltip.formatter = ({ data: point }) =>
      `${point.name}\nRent: AED ${format(point.value[0])}/month\nCommute: ${format(point.value[1])} min round trip\nPopulation: ${format(
        point.value[2]
      )}`;
    option.series = [{ name: "Districts", type: "scatter", data, symbolSize: (value) => 42 * Math.sqrt(value[2] / maximumPopulation) }];
    const omitted = zones.length - data.length;
    return result(
      definition,
      option,
      `${dated(context.snapshot)} · bubble area represents resident population`,
      `District rent is the current modeled resident-budget rent; commute averages cover completed commuters living in the district. ${
        assignmentDate(context.snapshot) ? `Travel assignment: ${assignmentDate(context.snapshot)}.` : "Travel assignment date unavailable."
      } A nonworkday snapshot can retain the last workday commute. These district averages do not establish household-level relationships or causation.${
        omitted ? ` ${omitted} districts lack usable observations and are omitted.` : ""
      }`,
      data
        .map((point) => `${point.name}: AED ${format(point.value[0])} rent, ${format(point.value[1])} minutes, ${format(point.value[2])} residents`)
        .join("; ") + "."
    );
  }

  function transitionsChart(definition, context, palette) {
    const history = Array.isArray(context.history) ? context.history : [];
    const validDays = history.map((entry) => entry.day).filter(finite);
    const latest = finite(context.snapshot?.clock?.day) ? context.snapshot.clock.day : validDays.length ? Math.max(...validDays) : null;
    if (!finite(latest) || latest < 1) return emptyResult(definition, palette, "No completed daily transition observations are available.");
    const requested = finite(context.windowDays) && context.windowDays > 0 ? Math.floor(context.windowDays) : 30;
    const window = Math.max(1, Math.min(30, requested));
    const first = Math.max(1, latest - window + 1);
    const days = new Map(
      history.filter((entry) => finite(entry.day) && entry.day >= first && entry.day <= latest).map((entry) => [entry.day, entry])
    );
    const observations = [...days.values()].filter((entry) => Array.isArray(entry.transitions?.citizens));
    if (!observations.length)
      return emptyResult(definition, palette, "No detailed transition rows remain for the selected window; detail is retained for at most 30 days.");
    const matrix = STATES.map(() => STATES.map(() => 0));
    let invalidRows = 0;
    for (const observation of observations) {
      for (const row of observation.transitions.citizens) {
        if (context.selectedZoneId && String(row.zoneId) !== String(context.selectedZoneId)) continue;
        const from = STATES.indexOf(row.fromState);
        const to = STATES.indexOf(row.toState);
        if (from < 0 || to < 0 || !nonnegative(row.representedResidents)) {
          invalidRows += 1;
          continue;
        }
        matrix[from][to] += row.representedResidents;
      }
    }
    if (invalidRows)
      return emptyResult(
        definition,
        palette,
        `${invalidRows} retained transition rows have incomplete states or counts; missing events cannot be shown as zero.`
      );
    const cells = matrix.flatMap((row, from) => row.map((value, to) => [to, from, value]));
    const maximum = Math.max(...cells.map((cell) => cell[2]));
    const total = cells.reduce((sum, cell) => sum + cell[2], 0);
    const option = baseOption(palette);
    option.legend.show = false;
    option.grid = { top: 32, left: 128, right: 28, bottom: 92 };
    option.xAxis = {
      ...option.xAxis,
      data: STATE_LABELS,
      name: "To state",
      nameLocation: "middle",
      nameGap: 40,
      axisLabel: { interval: 0, fontSize: 10, formatter: (label) => label.replace(" ", "\n") },
    };
    option.yAxis = {
      ...option.yAxis,
      type: "category",
      inverse: true,
      data: STATE_LABELS,
      name: "From state",
      nameLocation: "start",
      nameTextStyle: { align: "right" },
      axisLabel: { fontSize: 10 },
      splitLine: { show: false },
    };
    option.visualMap = {
      min: 0,
      max: Math.max(1, maximum),
      orient: "horizontal",
      left: "center",
      bottom: 0,
      calculable: false,
      inRange: { color: ["#edf2ee", palette.green] },
    };
    option.tooltip.trigger = "item";
    option.tooltip.formatter = ({ value }) =>
      `${STATE_LABELS[value[1]]} → ${STATE_LABELS[value[0]]}\n${format(value[2])} represented transition events`;
    option.series = [{ name: "Transitions", type: "heatmap", data: cells, label: { show: true, formatter: ({ value }) => format(value[2]) } }];
    const districtName = context.selectedZoneId
      ? context.snapshot?.zones?.find((zone) => String(zone.id) === String(context.selectedZoneId))?.name || String(context.selectedZoneId)
      : "all districts";
    const district = ` · ${districtName}`;
    return result(
      definition,
      option,
      `Days ${first}–${latest} · ${observations.length} recorded daily observations${district}`,
      `Movement and transition detail is retained for at most 30 days. Counts are represented transition events, not unique residents, probabilities or state occupancy. A cohort can transition more than once.${
        observations.length < latest - first + 1 ? " Some days have no retained observations; they are not treated as zero-event days." : ""
      }`,
      `${districtName}, days ${first}–${latest}: ${format(total)} represented transition events. ` +
        cells
          .filter((cell) => cell[2] > 0)
          .map(([to, from, count]) => `${STATE_LABELS[from]} to ${STATE_LABELS[to]}: ${format(count)}`)
          .join("; ")
    );
  }

  function laborChart(definition, context, palette) {
    const keys = ["representedEmployed", "representedUnemployed", "representedNonparticipants"];
    const composition = (snapshot) => {
      const city = cityOf(snapshot);
      const total = city?.representedPopulation;
      if (!finite(total) || total <= 0 || keys.some((key) => !nonnegative(city?.[key]))) return null;
      const counts = keys.map((key) => city[key]);
      return Math.abs(counts.reduce((sum, value) => sum + value, 0) - total) < 1e-7
        ? { counts, shares: counts.map((count) => (count / total) * 100), total }
        : null;
    };
    const active = composition(context.snapshot);
    if (!active) return emptyResult(definition, palette, "Complete, reconciled resident labor-force stocks are unavailable.");
    const reference = referenceStatus(context);
    const referenceValues = reference.available ? composition(context.referenceSnapshot) : null;
    const observations = [active, ...(referenceValues ? [referenceValues] : [])];
    const names = ["Employed", "Active job seekers", "Outside labor force"];
    const option = baseOption(palette);
    option.grid.bottom = 35;
    option.grid.left = 82;
    option.xAxis = { ...option.xAxis, type: "value", max: 100, axisLabel: { formatter: "{value}%" } };
    option.yAxis = { ...option.yAxis, type: "category", data: referenceValues ? ["Scenario", "Reference"] : ["Scenario"] };
    option.series = names.map((name, index) => ({
      name,
      type: "bar",
      stack: "population",
      barMaxWidth: 42,
      data: observations.map((row) => ({ value: row.shares[index], observedCount: row.counts[index], populationTotal: row.total })),
      itemStyle: { color: [palette.green, palette.amber, palette.sand][index] },
    }));
    option.tooltip.formatter = (rows) => {
      const entries = Array.isArray(rows) ? rows : [rows];
      const index = entries[0]?.dataIndex;
      if (!Number.isInteger(index) || !observations[index]) return "";
      const row = observations[index];
      const visible = new Set(entries.map((entry) => entry.seriesName));
      return [
        index === 0 ? "Scenario" : "Reference",
        ...names.flatMap((name, segment) =>
          visible.has(name) ? [`${name}: ${format(row.shares[segment])}% (${format(row.counts[segment])} / ${format(row.total)} residents)`] : []
        ),
      ].join("\n");
    };
    const referenceNote =
      reference.note || (reference.available && !referenceValues ? "Reference labor-force stocks are incomplete or do not reconcile." : "");
    return result(
      definition,
      option,
      `${dated(context.snapshot)} · shares of all represented residents`,
      `Employed + active job seekers + nonparticipants = resident stock. The job-seeker share here uses all residents; the unemployment-rate KPI uses labor-force participants.${
        referenceNote ? ` ${referenceNote}` : ""
      }`,
      observations
        .map(
          (row, observation) =>
            `${observation === 0 ? "Scenario" : "Reference"}: ` +
            names.map((name, index) => `${name}: ${format(row.counts[index])} residents (${format(row.shares[index])}%)`).join("; ")
        )
        .join(". ") + "."
    );
  }

  function completeCommuters(metric) {
    const counts = [metric?.modeCounts?.car, metric?.modeCounts?.pt, metric?.modeCounts?.walk];
    return counts.every(nonnegative) ? counts.reduce((sum, value) => sum + value, 0) : null;
  }

  function comparisonReference(context, travel = false) {
    const reference = referenceStatus(context);
    if (
      travel &&
      reference.available &&
      assignmentDate(context.snapshot) &&
      assignmentDate(context.referenceSnapshot) &&
      assignmentDate(context.snapshot) !== assignmentDate(context.referenceSnapshot)
    ) {
      return { available: false, note: "Travel reference omitted because assignment dates differ." };
    }
    return reference;
  }

  function compact(value) {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
  }

  function valueDomain(values, minimumMaximum = 1) {
    const present = values.filter(finite);
    const low = Math.min(0, ...present);
    const high = Math.max(minimumMaximum, ...present);
    const scale = 10 ** Math.floor(Math.log10(Math.max(high - low, 1))) / 2;
    return { min: Math.floor(low / scale) * scale, max: Math.ceil(high / scale) * scale };
  }

  function pairedSeries(id, rows, xAxisIndex, yAxisIndex, palette, showLabels = false) {
    const connectors = rows.flatMap((row, index) =>
      finite(row.scenario) && finite(row.reference) ? [[row.scenario, index], [row.reference, index], null] : []
    );
    const points = (field, source) =>
      rows.flatMap((row, index) =>
        finite(row[field])
          ? [
              {
                value: [row[field], index],
                zoneId: row.zoneId,
                name: row.name,
                source,
                unit: row.unit,
                scenario: row.scenario,
                reference: row.reference,
              },
            ]
          : []
      );
    return [
      {
        id: `${id}:connectors`,
        name: "Difference",
        type: "line",
        xAxisIndex,
        yAxisIndex,
        data: connectors,
        showSymbol: false,
        connectNulls: false,
        silent: true,
        tooltip: { show: false },
        lineStyle: { color: palette.sand, width: 2 },
        z: 1,
      },
      {
        id: `${id}:reference`,
        name: "Reference",
        type: "scatter",
        xAxisIndex,
        yAxisIndex,
        data: points("reference", "Reference"),
        symbol: "emptyCircle",
        symbolSize: 10,
        itemStyle: { color: palette.blue },
        label: { show: showLabels, position: "bottom", fontSize: 9, formatter: ({ value }) => compact(value[0]) },
        z: 2,
      },
      {
        id: `${id}:scenario`,
        name: "Scenario",
        type: "scatter",
        xAxisIndex,
        yAxisIndex,
        data: points("scenario", "Scenario"),
        symbolSize: 7,
        itemStyle: { color: palette.green },
        label: { show: showLabels, position: "top", fontSize: 9, formatter: ({ value }) => compact(value[0]) },
        z: 3,
      },
    ];
  }

  function pairedTooltip({ data: point }) {
    if (!point?.value) return "";
    const lines = [point.name, `${point.source}: ${format(point.value[0])} ${point.unit}`];
    if (finite(point.scenario) && finite(point.reference)) {
      const delta = point.scenario - point.reference;
      lines.push(`Scenario − reference: ${delta > 0 ? "+" : ""}${format(delta)} ${point.unit === "%" ? "percentage points" : point.unit}`);
    }
    return lines.join("\n");
  }

  function outcomeComparisonChart(definition, context, palette) {
    const active = cityOf(context.snapshot);
    const reference = comparisonReference(context);
    const travelReference = comparisonReference(context, true);
    const other = reference.available ? cityOf(context.referenceSnapshot) : null;
    const metrics = [
      {
        id: "commute",
        label: "Commute",
        axisUnit: "minutes",
        deltaUnit: "min",
        field: "averageRoundTripMinutes",
        travel: true,
        denominator: (city) => completeCommuters(city),
        maximum: 10,
      },
      {
        id: "transit",
        label: "Transit share",
        axisUnit: "%",
        deltaUnit: "pp",
        field: "modeShares",
        subfield: "pt",
        travel: true,
        denominator: (city) => completeCommuters(city),
        maximum: 100,
      },
      {
        id: "unemployment",
        label: "Unemployment",
        axisUnit: "%",
        deltaUnit: "pp",
        field: "unemploymentRate",
        denominator: (city) => city?.representedLaborForce,
        maximum: 100,
      },
      {
        id: "access",
        label: "Vehicle access",
        axisUnit: "%",
        deltaUnit: "pp",
        field: "carOwnershipRate",
        denominator: (city) => city?.representedPopulation,
        maximum: 100,
      },
      {
        id: "resources",
        label: "After essentials",
        axisUnit: "AED",
        deltaUnit: "AED",
        field: "averageResidualAfterEssentialsAed",
        denominator: (city) => city?.representedPopulation,
        maximum: 1000,
      },
      {
        id: "housing",
        label: "Housing occupancy",
        axisUnit: "%",
        deltaUnit: "pp",
        field: "housingOccupancyRate",
        denominator: (city) => city?.housingCapacityRepresented,
        maximum: 100,
      },
    ];
    const rows = metrics.map((metric) => {
      const value = (city) => {
        const raw = metric.subfield ? city?.[metric.field]?.[metric.subfield] : city?.[metric.field];
        return metric.denominator(city) > 0 && finite(raw) ? raw : null;
      };
      return {
        ...metric,
        name: `${metric.label} (${metric.axisUnit})`,
        unit: metric.axisUnit,
        scenario: value(active),
        reference: metric.travel && !travelReference.available ? null : value(other),
      };
    });
    if (!rows.some((row) => finite(row.scenario) || finite(row.reference)))
      return emptyResult(definition, palette, "No outcome has a recorded value with a usable denominator.");
    const option = baseOption(palette);
    option.title = [];
    option.grid = [];
    option.xAxis = [];
    option.yAxis = [];
    option.legend = {
      ...option.legend,
      data: ["Scenario", ...(rows.some((row) => finite(row.reference)) ? ["Reference"] : [])],
      left: "center",
      right: null,
      top: 0,
    };
    option.tooltip = { ...option.tooltip, trigger: "item", formatter: pairedTooltip };
    rows.forEach((row, index) => {
      const column = index % 2;
      const line = Math.floor(index / 2);
      const comparable = finite(row.scenario) && finite(row.reference);
      const delta = comparable ? row.scenario - row.reference : null;
      option.title.push({
        text: row.name,
        subtext: comparable
          ? `${delta > 0 ? "+" : ""}${format(delta)} ${row.deltaUnit} vs reference`
          : finite(row.scenario)
            ? context.compare
              ? "Reference unavailable"
              : "Scenario"
            : "Scenario unavailable",
        left: `${column * 50 + 4}%`,
        top: `${line * 30 + 7}%`,
        textStyle: { color: palette.ink, fontSize: 10, fontWeight: 500 },
        subtextStyle: { color: palette.muted, fontSize: 9 },
        itemGap: 3,
      });
      option.grid.push({ left: `${column * 50 + 6}%`, top: `${line * 30 + 20}%`, width: "37%", height: "10%" });
      const present = finite(row.scenario) || finite(row.reference);
      option.xAxis.push({
        type: "value",
        gridIndex: index,
        show: present,
        ...valueDomain([row.scenario, row.reference], row.maximum),
        splitNumber: 2,
        axisLabel: { color: palette.muted, fontSize: 9, formatter: compact, hideOverlap: true },
        axisLine: { lineStyle: { color: palette.line } },
        splitLine: { show: false },
      });
      option.yAxis.push({ type: "category", gridIndex: index, data: [row.label], show: false });
      option.series.push(...pairedSeries(`outcome:${row.id}`, [row], index, index, palette, true));
    });
    const notes = [
      "Each panel has its own labeled unit and scale; lengths across panels are not comparable and no combined score is calculated. Positive differences mean a larger value, not necessarily an improvement.",
      "Travel covers completed commuters; unemployment uses labor-force participants, vehicle access uses all residents, and occupancy uses modeled housing capacity. After-essentials resources use resident accounting periods, including opening estimates for new cohorts.",
    ];
    if (reference.note) notes.push(reference.note);
    if (travelReference.note && travelReference.note !== reference.note) notes.push(travelReference.note);
    if (!context.compare) notes.push("Reference comparison is hidden.");
    const built = result(
      definition,
      option,
      `${dated(context.snapshot)} · six outcomes with separate scales`,
      notes.join(" "),
      rows
        .map(
          (row) =>
            `${row.name}: scenario ${finite(row.scenario) ? format(row.scenario) : "unavailable"}; reference ${
              finite(row.reference) ? format(row.reference) : "unavailable"
            }`
        )
        .join(". ")
    );
    return {
      ...built,
      layoutHint: { minHeight: 390 },
      metrics: rows.map(({ id, unit, scenario, reference }) => ({
        id,
        unit,
        scenario,
        reference,
        delta: finite(scenario) && finite(reference) ? scenario - reference : null,
      })),
    };
  }

  function districtCommuteChart(definition, context, palette) {
    const zones = Array.isArray(context.snapshot?.zones) ? context.snapshot.zones : [];
    const reference = comparisonReference(context, true);
    const references = new Map(
      (reference.available && Array.isArray(context.referenceSnapshot?.zones) ? context.referenceSnapshot.zones : []).map((zone) => [
        String(zone.id),
        zone,
      ])
    );
    const rows = zones
      .flatMap((zone) => {
        if (!(completeCommuters(zone) > 0) || !nonnegative(zone.averageRoundTripMinutes)) return [];
        const other = references.get(String(zone.id));
        return [
          {
            name: String(zone.name || zone.id),
            zoneId: String(zone.id),
            unit: "minutes",
            scenario: zone.averageRoundTripMinutes,
            reference: completeCommuters(other) > 0 && nonnegative(other.averageRoundTripMinutes) ? other.averageRoundTripMinutes : null,
          },
        ];
      })
      .sort((a, b) => b.scenario - a.scenario || a.name.localeCompare(b.name));
    if (!rows.length) return emptyResult(definition, palette, "No district has a recorded mean and completed commuters.");
    const option = baseOption(palette);
    option.legend = { ...option.legend, data: ["Scenario", ...(rows.some((row) => finite(row.reference)) ? ["Reference"] : [])] };
    option.grid = { top: 36, left: 120, right: 20, bottom: 44 };
    option.xAxis = {
      type: "value",
      ...valueDomain(
        rows.flatMap((row) => [row.scenario, row.reference]),
        10
      ),
      name: "Mean round-trip minutes",
      nameLocation: "middle",
      nameGap: 27,
      splitNumber: 3,
      axisLabel: { color: palette.muted, fontSize: 10 },
      splitLine: { lineStyle: { color: "#e8ece9" } },
    };
    option.yAxis = {
      type: "category",
      inverse: true,
      data: rows.map((row) => row.name),
      axisLabel: { color: palette.muted, width: 110, overflow: "truncate", interval: 0, fontSize: 10 },
      axisTick: { show: false },
      axisLine: { show: false },
    };
    option.tooltip = { ...option.tooltip, trigger: "item", formatter: pairedTooltip };
    option.series = pairedSeries("district-commute", rows, 0, 0, palette);
    const note = `Each point is a district mean for completed commuters living there, not a distribution of individual travel times. Unserved commuters and districts without usable observations are excluded. ${
      assignmentDate(context.snapshot) ? `Travel assignment: ${assignmentDate(context.snapshot)}.` : "Travel assignment date unavailable."
    } ${reference.note || (context.compare ? "Missing reference districts remain unavailable." : "Reference comparison is hidden.")}`;
    return {
      ...result(
        definition,
        option,
        `${dated(context.snapshot)} · districts ranked by scenario commute duration`,
        note,
        rows
          .map(
            (row) =>
              `${row.name}: scenario ${format(row.scenario)} min; reference ${finite(row.reference) ? `${format(row.reference)} min` : "unavailable"}`
          )
          .join(". ")
      ),
      layoutHint: { minHeight: Math.max(350, rows.length * 18 + 80) },
    };
  }

  function districtHousingChart(definition, context, palette) {
    const zones = Array.isArray(context.snapshot?.zones) ? context.snapshot.zones : [];
    const reference = comparisonReference(context);
    const references = new Map(
      (reference.available && Array.isArray(context.referenceSnapshot?.zones) ? context.referenceSnapshot.zones : []).map((zone) => [
        String(zone.id),
        zone,
      ])
    );
    const occupancy = (zone) => (zone?.housingCapacityRepresented > 0 && nonnegative(zone?.housingOccupancyRate) ? zone.housingOccupancyRate : null);
    const rent = (zone) => (nonnegative(zone?.residentialRentAed) ? zone.residentialRentAed : null);
    const rows = zones
      .map((zone) => ({
        zoneId: String(zone.id),
        name: String(zone.name || zone.id),
        occupancy: occupancy(zone),
        rent: rent(zone),
        other: references.get(String(zone.id)),
      }))
      .filter((row) => finite(row.occupancy) || finite(row.rent))
      .sort((a, b) => (b.occupancy ?? -Infinity) - (a.occupancy ?? -Infinity) || a.name.localeCompare(b.name));
    if (!rows.length) return emptyResult(definition, palette, "No complete district housing occupancy or rent observations are available.");
    const option = baseOption(palette);
    option.legend = {
      ...option.legend,
      data: ["Scenario", ...(rows.some((row) => finite(occupancy(row.other)) || finite(rent(row.other))) ? ["Reference"] : [])],
      left: "center",
      top: 0,
    };
    option.title = [
      { text: "Occupancy (%)", left: 120, top: 25, textStyle: { color: palette.ink, fontSize: 10, fontWeight: 500 } },
      { text: "Rent (AED/month)", left: "62%", top: 25, textStyle: { color: palette.ink, fontSize: 10, fontWeight: 500 } },
    ];
    option.grid = [
      { top: 56, left: 120, right: "44%", bottom: 38 },
      { top: 56, left: "62%", right: 14, bottom: 38 },
    ];
    option.xAxis = [];
    option.yAxis = [];
    ["occupancy", "rent"].forEach((kind, index) => {
      const observations = rows.map((row) => ({
        name: row.name,
        zoneId: row.zoneId,
        unit: index === 0 ? "%" : "AED/month",
        scenario: row[kind],
        reference: index === 0 ? occupancy(row.other) : rent(row.other),
      }));
      option.xAxis.push({
        type: "value",
        gridIndex: index,
        ...valueDomain(
          observations.flatMap((row) => [row.scenario, row.reference]),
          index === 0 ? 100 : 1000
        ),
        splitNumber: 2,
        axisLabel: { color: palette.muted, fontSize: 9, formatter: compact },
        splitLine: { lineStyle: { color: "#e8ece9" } },
      });
      option.yAxis.push({
        type: "category",
        gridIndex: index,
        inverse: true,
        data: rows.map((row) => row.name),
        axisLabel: { show: index === 0, color: palette.muted, width: 110, overflow: "truncate", interval: 0, fontSize: 10 },
        axisTick: { show: false },
        axisLine: { show: false },
      });
      option.series.push(...pairedSeries(`district-housing:${kind}`, observations, index, index, palette));
    });
    option.tooltip = { ...option.tooltip, trigger: "item", formatter: pairedTooltip };
    return {
      ...result(
        definition,
        option,
        `${dated(context.snapshot)} · common district order, separate occupancy and rent scales`,
        `Occupancy is resident demand / modeled housing capacity and can exceed 100%. Rent is the current modeled residential cost per resident budget, not an observed household market-rent sample. Districts are ranked by scenario occupancy; missing values are omitted rather than plotted as zero. ${
          reference.note || (context.compare ? "Scenario and reference are matched by district id." : "Reference comparison is hidden.")
        }`,
        rows
          .map(
            (row) =>
              `${row.name}: scenario occupancy ${finite(row.occupancy) ? `${format(row.occupancy)}%` : "unavailable"}, rent ${
                finite(row.rent) ? `AED ${format(row.rent)}` : "unavailable"
              }; reference occupancy ${finite(occupancy(row.other)) ? `${format(occupancy(row.other))}%` : "unavailable"}, rent ${
                finite(rent(row.other)) ? `AED ${format(rent(row.other))}` : "unavailable"
              }`
          )
          .join(". ")
      ),
      layoutHint: { minHeight: Math.max(350, rows.length * 18 + 100) },
    };
  }

  function networkCoverageChart(definition, context, palette) {
    const links = Array.isArray(context.snapshot?.links) ? context.snapshot.links : [];
    const unique = new Map(links.filter((link) => typeof link?.id === "string" && link.id).map((link) => [link.id, link]));
    if (!unique.size) return emptyResult(definition, palette, "No identified physical-link assignment records are available.");
    const categories = [
      { id: "assigned-car", label: "Car demand assigned", color: palette.green },
      { id: "transit-only", label: "Transit demand only", color: palette.blue },
      { id: "unassigned", label: "No demand assigned", color: palette.amber },
      { id: "capacity-excluded", label: "Access: capacity excluded", color: palette.sand },
      { id: "context", label: "Context geometry", color: palette.muted },
      { id: "unavailable", label: "Assignment unavailable", color: palette.red },
    ].map((category) => ({ ...category, count: 0 }));
    const byId = new Map(categories.map((category) => [category.id, category]));
    for (const link of unique.values()) {
      let status;
      if (link.loadBearing === false || link.capacityExclusionReason || link.capacityExcludedReason) status = "capacity-excluded";
      else if (link.contextOnly === true || link.hidden === true || link.modelVisible === false) status = "context";
      else {
        const loads = [link.loadABVehicles, link.loadBAVehicles, link.loadABPassengers, link.loadBAPassengers];
        if (!loads.every(nonnegative)) status = "unavailable";
        else if (loads[0] + loads[1] > 0) status = "assigned-car";
        else if (loads[2] + loads[3] > 0) status = "transit-only";
        else status = "unassigned";
      }
      byId.get(status).count += 1;
    }
    const option = baseOption(palette);
    option.grid = { top: 42, left: 144, right: 34, bottom: 42 };
    const visibleCategories = categories.filter(
      (category) => !["capacity-excluded", "context", "unavailable"].includes(category.id) || category.count > 0
    );
    option.legend = { show: false };
    option.xAxis = {
      type: "value",
      name: "Unique physical links",
      nameLocation: "middle",
      nameGap: 28,
      minInterval: 1,
      splitNumber: 3,
      axisLabel: { color: palette.muted, fontSize: 10 },
      splitLine: { lineStyle: { color: "#e8ece9" } },
    };
    option.yAxis = {
      type: "category",
      inverse: true,
      data: visibleCategories.map((category) => category.label),
      axisLabel: { color: palette.muted, width: 134, overflow: "truncate", interval: 0, fontSize: 10 },
      axisTick: { show: false },
      axisLine: { show: false },
    };
    option.series = visibleCategories.map((category) => ({
      id: `coverage:${category.id}`,
      name: category.label,
      type: "bar",
      stack: "coverage",
      barMaxWidth: 22,
      data: visibleCategories.map((row) => (row.id === category.id ? { value: category.count, categoryId: category.id } : null)),
      itemStyle: { color: category.color },
      label: { show: true, position: "right", color: palette.ink, formatter: ({ value }) => (finite(value) ? format(value) : "") },
    }));
    option.tooltip.trigger = "item";
    option.tooltip.formatter = ({ data }) =>
      data && byId.has(data.categoryId)
        ? `${byId.get(data.categoryId).label}\n${format(data.value)} / ${format(unique.size)} unique physical links`
        : "";
    const missingIds = links.filter((link) => typeof link?.id !== "string" || !link.id).length;
    return {
      ...result(
        definition,
        option,
        `${format(unique.size)} physical links · ${
          assignmentDate(context.snapshot) ? `assignment ${assignmentDate(context.snapshot)}` : "assignment date unavailable"
        }`,
        `Demand is the last modeled work-trip assignment, not observed all-purpose traffic. Categories are exclusive: links carrying both car and transit demand count once under car demand. ${
          byId.get("capacity-excluded").count
            ? "Capacity-excluded links are separate from links with no assigned demand. "
            : "Every physical road in this baseline receives shared directional demand. "
        }Missing directional loads are unavailable, not zero. Sparse animation arrows do not represent missing demand. ${
          missingIds ? `${missingIds} unidentified link records were omitted.` : ""
        }`.trim(),
        categories.map((category) => `${category.label}: ${format(category.count)}`).join("; ") + "."
      ),
      layoutHint: { minHeight: 350 },
      counts: Object.fromEntries(categories.map((category) => [category.id, category.count])),
      totalLinks: unique.size,
    };
  }

  function selectedZone(context, snapshot = context.snapshot) {
    const id = context.selectedZoneId;
    return typeof id === "string" && id && id !== "city"
      ? (Array.isArray(snapshot?.zones) ? snapshot.zones : []).find((zone) => String(zone.id) === id) || null
      : null;
  }

  function observedNumber(object, fields) {
    for (const field of fields) if (nonnegative(object?.[field])) return object[field];
    return null;
  }

  function observationDate(value) {
    if (!(typeof value === "string" || value instanceof Date)) return null;
    const time = new Date(value).valueOf();
    return finite(time) ? new Date(time).toISOString().slice(0, 10) : null;
  }

  // Retained observations and the current snapshot are separate measured points.
  // No current field is copied backwards into an older history row.
  function selectedHistory(context, reference = false) {
    const snapshot = reference ? context.referenceSnapshot : context.snapshot;
    const source = reference ? context.referenceHistory : context.history;
    const end = context.snapshot?.clock?.day;
    if (!nonnegative(end) || typeof context.selectedZoneId !== "string" || context.selectedZoneId === "city") return [];
    const window = [30, 90, 365].includes(context.historyWindowDays) ? context.historyWindowDays : 0;
    const start = window ? Math.max(0, end - window + 1) : 0;
    const points = new Map();
    const add = (point, zones) => {
      const day = point?.day ?? point?.clock?.day;
      const date = observationDate(point?.date ?? point?.clock?.date);
      if (!nonnegative(day) || day < start || day > end || !date) return;
      const zone = (Array.isArray(zones) ? zones : []).find((entry) => String(entry.id) === context.selectedZoneId);
      if (zone) points.set(day, { day, date, zone });
    };
    for (const point of Array.isArray(source) ? source : []) add(point, point.zoneSeries || point.zones);
    add(snapshot, snapshot?.zones);
    return [...points.values()].sort((a, b) => a.day - b.day);
  }

  function districtHistoryChart(definition, context, palette) {
    const observations = selectedHistory(context);
    const specifications = {
      "district-population-history": {
        fields: [
          ["Residents", ["representedPopulation", "population"]],
          ["Housing capacity", ["housingCapacityRepresented", "housingCapacity"]],
        ],
        unit: "Represented residents",
        note: "Capacity is a modeled resident-space assumption; it is not a count of observed housing units. Soft capacity can be exceeded.",
      },
      "district-rent-history": {
        fields: [["Residential rent", ["residentialRentAed"]]],
        unit: "AED / resident / month",
        note: "The district's modeled monthly residential cost per resident budget, not an observed household rent series.",
      },
      "district-employment-history": {
        fields: [
          ["Employed residents", ["representedEmployed"]],
          ["Jobs in district", ["jobs"]],
        ],
        unit: "Represented workers",
        note: "Employed residents are counted by home; filled local jobs are counted by workplace. Jobs are not vacancies or physical job capacity. Missing historical employment counts are not reconstructed from rounded rates.",
      },
    };
    const specification = specifications[definition.id];
    if (!observations.some((point) => specification.fields.some(([, fields]) => finite(observedNumber(point.zone, fields)))))
      return emptyResult(definition, palette, "Select a district with recorded, dated observations for this measure.");
    const references = new Map(selectedHistory(context, true).map((point) => [point.day, point]));
    const option = baseOption(palette);
    option.grid = { top: 44, left: 58, right: 16, bottom: 44 };
    option.legend = { ...option.legend, type: "scroll", left: 0, right: 0, top: 0 };
    option.xAxis = { type: "time", axisLabel: { color: palette.muted, hideOverlap: true }, splitLine: { show: false } };
    option.yAxis = { ...option.yAxis, min: 0, name: specification.unit, nameTextStyle: { fontSize: 9 }, axisLabel: { formatter: compact } };
    const summaries = [];
    let referenceValues = 0;
    specification.fields.forEach(([name, fields], index) => {
      const colors = [palette.green, palette.blue];
      const createSeries = (isReference) => ({
        id: `${definition.id}:${index}:${isReference ? "reference" : "scenario"}`,
        name: `${name}${isReference ? " · reference" : ""}`,
        type: "line",
        showSymbol: observations.length <= 90,
        symbolSize: 4,
        connectNulls: false,
        smooth: false,
        ...(definition.id === "district-rent-history" ? { step: "end" } : {}),
        lineStyle: { color: colors[index], type: isReference ? "dashed" : "solid", width: isReference ? 1.5 : 2 },
        itemStyle: { color: colors[index], opacity: isReference ? 0.65 : 1 },
        data: observations.map((point) => {
          const other = references.get(point.day);
          const observed = isReference ? (other?.date === point.date ? other.zone : null) : point.zone;
          const value = observedNumber(observed, fields);
          if (isReference && finite(value)) referenceValues += 1;
          return [Date.parse(`${point.date}T00:00:00Z`), value];
        }),
      });
      const scenario = createSeries(false);
      if (scenario.data.some(([, value]) => finite(value))) option.series.push(scenario);
      if (context.compare) {
        const other = createSeries(true);
        if (other.data.some(([, value]) => finite(value))) option.series.push(other);
      }
      const latest = scenario.data.findLast(([, value]) => finite(value));
      if (latest) summaries.push(`${name}: latest recorded ${format(latest[1])}`);
    });
    option.tooltip.formatter = (entries) => {
      const visible = (Array.isArray(entries) ? entries : [entries]).filter((entry) => finite(entry?.value?.[1]));
      return visible.length
        ? [
            new Date(visible[0].value[0]).toISOString().slice(0, 10),
            ...visible.map((entry) => `${entry.seriesName}: ${format(entry.value[1])} ${specification.unit}`),
          ].join("\n")
        : "No recorded observation";
    };
    const name = selectedZone(context)?.name || context.selectedZoneId;
    return result(
      definition,
      option,
      `${name} · ${specification.unit} · ${observations[0].date}–${observations.at(-1).date}`,
      `${specification.note} Only retained observations are plotted; missing values remain gaps. ${
        context.compare
          ? referenceValues
            ? "Reference values are joined by the same district, model day and calendar date; unmatched observations are omitted."
            : "No matching district reference history is available."
          : "Reference comparison is hidden."
      }`,
      `${name}. ${observations.length} recorded dates, ${observations[0].date} to ${observations.at(-1).date}. ${summaries.join("; ")}.`
    );
  }

  function districtCompositionChart(definition, context, palette) {
    const zone = selectedZone(context);
    const mode = definition.id === "district-travel-modes";
    const firm = definition.id === "district-enterprise-states";
    const specification = mode
      ? {
          field: "modeCounts",
          keys: ["car", "pt", "walk", "unserved", "none"],
          labels: ["Car", "Transit", "Walk", "Unserved", "No commute"],
          colors: [palette.blue, palette.green, palette.amber, palette.red, palette.sand],
        }
      : firm
        ? {
            field: "enterpriseStateCounts",
            keys: ["Working", "Grow", "Lesser", "Starting"],
            labels: ["Stable", "Expanding", "Contracting", "Starting"],
            colors: [palette.green, palette.blue, palette.amber, palette.sand],
          }
        : { field: "stateCounts", keys: STATES, labels: STATE_LABELS, colors: [palette.green, palette.amber, palette.red, palette.blue] };
    const countsOf = (entry) => {
      const total = firm ? entry?.enterprises : mode ? entry?.representedEmployed : observedNumber(entry, ["representedPopulation", "population"]);
      const counts = specification.keys.map((key) =>
        mode && key === "unserved" && entry?.modeCounts && !Object.hasOwn(entry.modeCounts, key) ? 0 : entry?.[specification.field]?.[key]
      );
      return total > 0 && counts.every(nonnegative) && Math.abs(counts.reduce((a, b) => a + b, 0) - total) < 1e-6 ? { total, counts } : null;
    };
    const active = countsOf(zone);
    if (!active) return emptyResult(definition, palette, "Select a district with complete, reconciling state or mode counts.");
    const reference = comparisonReference(context, mode);
    const other = reference.available ? countsOf(selectedZone(context, context.referenceSnapshot)) : null;
    const rows = [{ name: "Scenario", ...active }, ...(other ? [{ name: "Reference", ...other }] : [])];
    const option = baseOption(palette);
    option.grid = { top: 52, left: 58, right: 14, bottom: 52 };
    option.legend = { ...option.legend, type: "scroll", left: 0, right: 0 };
    option.xAxis.data = rows.map((row) => row.name);
    option.yAxis = { ...option.yAxis, min: 0, max: 100, axisLabel: { formatter: "{value}%" } };
    option.series = specification.labels.map((name, index) => ({
      name,
      type: "bar",
      stack: "composition",
      barMaxWidth: 100,
      itemStyle: { color: specification.colors[index] },
      data: rows.map((row) => ({ value: (row.counts[index] / row.total) * 100, observedCount: row.counts[index], populationTotal: row.total })),
    }));
    const unit = firm ? "synthetic employers" : mode ? "represented employed residents" : "represented residents";
    option.tooltip.formatter = (entries) => {
      const shown = Array.isArray(entries) ? entries : [entries];
      const row = rows[shown[0]?.dataIndex];
      if (!row) return "";
      return [
        row.name,
        ...shown.map((entry) => {
          const index = specification.labels.indexOf(entry.seriesName);
          return index >= 0
            ? `${entry.seriesName}: ${format((row.counts[index] / row.total) * 100)}% (${format(row.counts[index])} / ${format(row.total)} ${unit})`
            : "";
        }),
      ]
        .filter(Boolean)
        .join("\n");
    };
    const note = mode
      ? "Current mode records for employed residents living here, including unserved and no-commute records; job seekers and nonparticipants are excluded. This denominator differs from completed-commuter mode shares. Nonworkdays can retain the last workday's mode, and later job or household decisions can change records."
      : firm
        ? "Shares count employer cohorts located in this district, not observed establishments or represented workers."
        : "Shares use every represented resident living in this district. These are current decision states, not event counts or measured wellbeing.";
    return result(
      definition,
      option,
      `${zone.name || zone.id} · ${dated(context.snapshot)} · ${format(active.total)} ${unit}`,
      `${note} ${reference.note || (context.compare && !other ? "Reference district counts are missing or do not reconcile." : "")}`.trim(),
      rows.map((row) => `${row.name}: ${specification.labels.map((name, index) => `${name} ${format(row.counts[index])}`).join(", ")}`).join(". ")
    );
  }

  function districtDestinations(context, snapshot) {
    const zone = selectedZone(context, snapshot);
    if (!zone || !Array.isArray(snapshot?.commuteOd)) return null;
    const rows = snapshot.commuteOd.filter(
      (row) => String(row.homeZoneId) === context.selectedZoneId && row.workZoneId !== null && row.workZoneId !== undefined
    );
    if (!rows.every((row) => typeof row.workZoneId === "string" && nonnegative(row.representedWorkers))) return null;
    const total = rows.reduce((sum, row) => sum + row.representedWorkers, 0);
    if (!nonnegative(zone.representedEmployed) || Math.abs(total - zone.representedEmployed) > 1e-6) return null;
    const output = new Map();
    for (const row of rows) {
      if (output.has(row.workZoneId)) return null;
      output.set(row.workZoneId, row);
    }
    return output;
  }

  function districtDestinationChart(definition, context, palette) {
    const commute = definition.id === "district-commute-destinations";
    const active = districtDestinations(context, context.snapshot);
    const zone = selectedZone(context);
    if (!active) return emptyResult(definition, palette, "Select a district with complete current home-to-work stock records.");
    const reference = comparisonReference(context, commute);
    const other = reference.available ? districtDestinations(context, context.referenceSnapshot) : null;
    const names = new Map(
      [...(context.referenceSnapshot?.zones || []), ...(context.snapshot?.zones || [])].map((entry) => [
        String(entry.id),
        String(entry.name || entry.id),
      ])
    );
    const valueOf = (row, observed) => {
      if (!row) return observed && !commute ? 0 : null;
      return commute
        ? completeCommuters(row) > 0 && nonnegative(row.averageRoundTripMinutes)
          ? row.averageRoundTripMinutes
          : null
        : row.representedWorkers;
    };
    const ids = new Set([...active.keys(), ...(other?.keys() || [])]);
    const rows = [...ids]
      .map((id) => ({
        zoneId: id,
        name: `${names.get(id) || id}${id === context.selectedZoneId ? " (same district)" : ""}`,
        scenario: valueOf(active.get(id), true),
        reference: valueOf(other?.get(id), Boolean(other)),
      }))
      .filter((row) => finite(row.scenario) || finite(row.reference))
      .sort((a, b) => (b.scenario ?? -1) - (a.scenario ?? -1) || a.name.localeCompare(b.name));
    if (!rows.length)
      return emptyResult(
        definition,
        palette,
        commute ? "No completed commuters have a recorded mean for this district." : "No employed residents have a current workplace destination."
      );
    const option = baseOption(palette);
    option.grid = { top: 34, left: 116, right: 18, bottom: 40 };
    option.yAxis = {
      type: "category",
      inverse: true,
      data: rows.map((row) => row.name),
      axisLabel: { color: palette.muted, width: 106, overflow: "truncate", interval: 0, fontSize: 9 },
      axisTick: { show: false },
      axisLine: { show: false },
    };
    const unit = commute ? "Mean round-trip minutes" : "Represented employed residents";
    option.xAxis = {
      type: "value",
      min: 0,
      name: commute ? "Round-trip minutes" : "Represented workers",
      nameLocation: "middle",
      nameGap: 26,
      axisLabel: { formatter: compact, color: palette.muted },
      splitLine: { lineStyle: { color: "#e8ece9" } },
    };
    option.series = [
      { name: "Scenario", field: "scenario", color: palette.green },
      ...(rows.some((row) => finite(row.reference)) ? [{ name: "Reference", field: "reference", color: palette.greenSoft }] : []),
    ].map(({ name, field, color }) => ({
      name,
      type: "bar",
      barMaxWidth: 14,
      itemStyle: { color },
      data: rows.map((row) => ({ value: row[field], zoneId: row.zoneId })),
    }));
    option.tooltip.formatter = (entries) => {
      const shown = Array.isArray(entries) ? entries : [entries];
      const row = rows[shown[0]?.dataIndex];
      return row
        ? [row.name, ...shown.filter((entry) => finite(entry.value)).map((entry) => `${entry.seriesName}: ${format(entry.value)} ${unit}`)].join("\n")
        : "";
    };
    const note = commute
      ? "Each bar is a completed-commuter mean for residents of this district working in the named destination. It is not a distribution of individual commute times; no histogram is inferred from averages or agent samples. Unserved and no-commute records are excluded. Current records can retain the last workday's travel values."
      : "Current home-to-work relationships, not daily trips, moves or migration. Job seekers and nonparticipants are excluded. A zero destination count is used only when complete district stock records establish absence.";
    return {
      ...result(
        definition,
        option,
        `${zone.name || zone.id} · ${dated(context.snapshot)} · ${commute ? "current destination means" : "current worker stock"}`,
        `${note} ${reference.note || (context.compare && !other ? "Reference district stock records are unavailable or incomplete." : "")}`.trim(),
        rows
          .map(
            (row) =>
              `${row.name}: scenario ${finite(row.scenario) ? format(row.scenario) : "unavailable"}${
                context.compare ? `; reference ${finite(row.reference) ? format(row.reference) : "unavailable"}` : ""
              }`
          )
          .join(". ")
      ),
      layoutHint: { minHeight: Math.max(280, rows.length * (other ? 28 : 19) + 90) },
    };
  }

  function buildOption(id, context = {}, suppliedPalette = {}) {
    const definition = CATALOG.find((entry) => entry.id === id);
    if (!definition) throw new Error(`Unknown analysis chart: ${id}`);
    const palette = { ...DEFAULT_PALETTE, ...suppliedPalette };
    if (definition.scope === "district") {
      if (definition.timeline) return districtHistoryChart(definition, context, palette);
      if (["district-work-destinations", "district-commute-destinations"].includes(id)) return districtDestinationChart(definition, context, palette);
      return districtCompositionChart(definition, context, palette);
    }
    if (id === "commute-distribution") return distributionChart(definition, context, palette, "commute");
    if (id === "resource-distribution") return distributionChart(definition, context, palette, "income");
    if (id === "enterprise-size") return distributionChart(definition, context, palette, "firmSize");
    if (id === "vehicle-access") return vehicleAccessChart(definition, context, palette);
    if (id === "district-tradeoff") return districtChart(definition, context, palette);
    if (id === "resident-transitions") return transitionsChart(definition, context, palette);
    if (id === "outcome-comparison") return outcomeComparisonChart(definition, context, palette);
    if (id === "district-commutes") return districtCommuteChart(definition, context, palette);
    if (id === "district-housing") return districtHousingChart(definition, context, palette);
    if (id === "network-coverage") return networkCoverageChart(definition, context, palette);
    return laborChart(definition, context, palette);
  }

  function buildFinancialStatusOption(context = {}, suppliedPalette = {}) {
    return distributionChart(
      { id: "financial-status", title: "Resident budgets", group: "Residents", scope: "current" },
      context,
      { ...DEFAULT_PALETTE, ...suppliedPalette },
      "financialStatus"
    );
  }

  const exported = { CATALOG, buildOption, buildFinancialStatusOption };
  if (typeof module !== "undefined" && module.exports) module.exports = exported;
  else scope.UdesV2Analysis = exported;
})(typeof globalThis !== "undefined" ? globalThis : this);
