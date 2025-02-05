import { EventData, Page, TextField } from '@nativescript/core';
import { SearchViewModel } from '../view-models/search-view-model';

let viewModel: SearchViewModel;

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  viewModel = new SearchViewModel();
  page.bindingContext = viewModel;
}

export function onBackTap() {
  viewModel.goBack();
}

export function onSearch(args: EventData) {
  const searchBar = <TextField>args.object;
  viewModel.search(searchBar.text);
}

export function onVoiceSearch() {
  viewModel.startVoiceSearch();
}