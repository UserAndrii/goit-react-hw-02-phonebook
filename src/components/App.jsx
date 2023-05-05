import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import Notiflix from 'notiflix';

import contacts from '../data/contacts.json';
import { Wrapper, Title, SecondTitle } from './App.styled';
import ContactForm from './ContactForm/ContactForm';
import Filter from './Filter/Filter';
import ContactList from './ContactList/ContactList';

export class App extends Component {
  state = {
    contacts: contacts,
    filter: '',
  };

  onDuplicateCheck = name => {
    return this.state.contacts.some(contact => contact.name === name);
  };

  onFormSubmit = e => {
    e.preventDefault();
    const { name, number } = e.currentTarget.elements;

    const contact = {
      id: nanoid(),
      name: name.value,
      number: number.value,
    };

    if (this.onDuplicateCheck(contact.name)) {
      e.currentTarget.reset();
      name.focus();
      Notiflix.Notify.failure(`${contact.name} is already in contacts`);
      // alert(`${contact.name} is already in contacts`);
      return;
    }

    this.setState(({ contacts }) => ({
      contacts: [contact, ...contacts],
    }));

    e.currentTarget.reset();
  };

  onChangeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  deleteContacts = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  render() {
    const { filter } = this.state;
    const visibleContacts = this.getVisibleContacts();

    return (
      <Wrapper>
        <Title>Phonebook</Title>
        <ContactForm onSubmit={this.onFormSubmit} />

        <SecondTitle>Contacts</SecondTitle>
        <Filter value={filter} onChange={this.onChangeFilter} />
        <ContactList
          contacts={visibleContacts}
          onDeleteContacts={this.deleteContacts}
        />
      </Wrapper>
    );
  }
}
