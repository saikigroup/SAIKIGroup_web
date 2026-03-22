import type { Locale } from './i18n';
import * as id from '@/content/locales/id';
import * as en from '@/content/locales/en';

const dictionaries = { id, en } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function getCommon(locale: Locale) {
  return dictionaries[locale].common;
}

export function getHome(locale: Locale) {
  return dictionaries[locale].home;
}

export function getAbout(locale: Locale) {
  return dictionaries[locale].about;
}

export function getServices(locale: Locale) {
  return dictionaries[locale].services;
}

export function getContact(locale: Locale) {
  return dictionaries[locale].contact;
}

export function getInsights(locale: Locale) {
  return dictionaries[locale].insights;
}
