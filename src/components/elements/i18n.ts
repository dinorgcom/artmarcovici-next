import type { BiestLang } from "@/lib/biestLang";
import type { ElementDatum, Metric } from "@/data/elements";
import {
  ELEMENT_NAMES_DE,
  ELEMENT_NOTES_DE,
  METRIC_DESCRIPTIONS_DE,
  METRIC_DIVISORS_DE,
  METRIC_LABELS_DE,
} from "@/data/elements-de";

export function elementName(el: ElementDatum, lang: BiestLang): string {
  return lang === "de" ? ELEMENT_NAMES_DE[el.z] ?? el.name : el.name;
}

export function elementNote(el: ElementDatum, lang: BiestLang): string | undefined {
  if (!el.note) return undefined;
  return lang === "de" ? ELEMENT_NOTES_DE[el.note] ?? el.note : el.note;
}

export function metricLabel(m: Metric, lang: BiestLang): string {
  return lang === "de" ? METRIC_LABELS_DE[m.key] : m.label;
}

export function metricDescription(m: Metric, lang: BiestLang): string {
  return lang === "de" ? METRIC_DESCRIPTIONS_DE[m.key] : m.description;
}

/** The thing a price is divided by, for the ranking explanation. */
export function metricDivisor(m: Metric, lang: BiestLang): string {
  return lang === "de" ? METRIC_DIVISORS_DE[m.key] : m.description.replace("price per ", "");
}
