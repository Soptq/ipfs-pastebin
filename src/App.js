import * as React from "react";
import { Block } from 'baseui/block';
import { Heading, HeadingLevel } from 'baseui/heading'
import { StatefulTabs, Tab } from "baseui/tabs-motion";
import CreateTab from "./components/CreateTab";
import FetchTab from "./components/FetchTab";
import './App.css';

import {ParagraphMedium, ParagraphSmall} from "baseui/typography";
import {
  Card
} from 'baseui/card';
import {Plus, ArrowDown} from 'baseui/icon'


function App() {
  return (
      <Block className={'main-block'}
          paddingLeft={['scale800', 'scale1200']}
          paddingRight={['scale800', 'scale1200']}
          paddingBottom={['scale400', 'scale400']}
      >
        <HeadingLevel>
          <Heading>
            <strong>Paste</strong> Planet
          </Heading>
          <ParagraphMedium>
            Paste Planet is a neutral, safe and decentralized Pastebin service. Paste your code, article, photo, anything and share it with the world using IPFS.
          </ParagraphMedium>
          <Card>
            <StatefulTabs>
              <Tab title="Create" artwork={Plus}>
                <CreateTab/>
              </Tab>
              <Tab title="Fetch" artwork={ArrowDown}>
                <FetchTab/>
              </Tab>
            </StatefulTabs>
          </Card>
          <center>
            <ParagraphSmall>
              Made With ❤️ By Soptq, Source Code @ https://github.com/Soptq/ipfs-pastebin
            </ParagraphSmall>
          </center>
        </HeadingLevel>
      </Block>
  );
}

export default App;
