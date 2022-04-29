import * as React from "react";
import { Block } from 'baseui/block';
import { Heading, HeadingLevel } from 'baseui/heading'
import { StatefulTabs, Tab } from "baseui/tabs-motion";
import CreateTab from "./components/CreateTab";
import FetchTab from "./components/FetchTab";
import './App.css';

import {ParagraphSmall} from "baseui/typography";


function App() {
  return (
      <Block width="600px">
        <HeadingLevel>
          <Heading>
            IPFS Pastebin
          </Heading>
          <StatefulTabs>
            <Tab title="Create">
              <CreateTab/>
            </Tab>
            <Tab title="Fetch">
              <FetchTab/>
            </Tab>
          </StatefulTabs>
          <div style={{marginTop: 200, marginBottom: 200}}/>
          <ParagraphSmall>Github Repo: https://github.com/Soptq/ipfs-pastebin</ParagraphSmall>
        </HeadingLevel>
      </Block>
  );
}

export default App;
