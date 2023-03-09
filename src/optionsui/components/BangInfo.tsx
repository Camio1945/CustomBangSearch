import React, { useEffect, useState } from 'react';

import {
  HStack, Input, Button, VStack,
} from '@chakra-ui/react';
import { DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons';

import { nanoid } from 'nanoid';

import { ReactfulBangInfo } from '../reactful';

type BangInfoPropTypes = {
  bangId: string,
  info: ReactfulBangInfo,
  removeBangInfo: (id: string) => void,
  updateBangInfo: (id: string, info: ReactfulBangInfo) => void,
  isLonely: boolean
};

export default function BangInfo(props: BangInfoPropTypes): React.ReactElement {
  const [urlInputs, setUrlInputs] = useState<React.ReactElement[]>([]);

  const {
    bangId, info, removeBangInfo, updateBangInfo, isLonely,
  } = props;

  const bangChanged = (e: any) => {
    const infoCopy = { ...info };
    infoCopy.bang = e.target.value;
    updateBangInfo(bangId, infoCopy);
  };

  const urlChanged = (e: any, id: string) => {
    const infoCopy = { ...info };
    infoCopy.urls = new Map(info.urls).set(id, e.target.value);
    updateBangInfo(bangId, infoCopy);
  };
  const deleteUrl = (id: string) => {
    const infoCopy = { ...info };
    const urlsCopy = new Map(info.urls);
    urlsCopy.delete(id);
    infoCopy.urls = urlsCopy;
    updateBangInfo(bangId, infoCopy);
  };
  const addUrl = () => {
    const infoCopy = { ...info };
    infoCopy.urls = new Map(info.urls).set(nanoid(21), 'https://example.com/?q=%s');
    updateBangInfo(bangId, infoCopy);
  };

  useEffect(() => {
    const inputs = [];
    for (const urlInfo of info.urls) {
      const urlId = urlInfo[0];
      const url = urlInfo[1];
      inputs.push(
        <HStack key={urlId}>
          <Input
            value={url}
            onChange={(e: any) => { urlChanged(e, urlId); }}
            placeholder="https://example.com/?q=%s"
            width="30em"
          />
          {info.urls.size > 1
            && (
            <Button title="Remove this URL" onClick={() => { deleteUrl(urlId); }} variant="ghost">
              <DeleteIcon />
            </Button>
            )}
        </HStack>,
      );
    }
    setUrlInputs(inputs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.urls]);

  return (
    <HStack align="top" paddingBottom="1em">
      {!isLonely
      && (
      <Button title="Remove this bang" onClick={() => { removeBangInfo(bangId); }} variant="ghost">
        <DeleteIcon />
      </Button>
      )}
      <Input value={info.bang} onChange={bangChanged} placeholder="bang" width="6em" />
      <VStack align="left">
        {urlInputs}
      </VStack>
      <Button onClick={addUrl} alignSelf="end" variant="ghost" title="Add URL to this bang">
        <PlusSquareIcon />
      </Button>
    </HStack>
  );
}
