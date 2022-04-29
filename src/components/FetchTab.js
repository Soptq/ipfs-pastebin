import * as React from "react";
import {HeadingLevel} from "baseui/heading";
import {ParagraphMedium} from "baseui/typography";
import {Input, SIZE} from "baseui/input";
import {Checkbox, LABEL_PLACEMENT} from "baseui/checkbox";
import {Button} from "baseui/button";
import { Tag, KIND } from "baseui/tag";
import {Block} from "baseui/block";
import { CopyBlock, solarizedDark } from "react-code-blocks";
import {Web3Storage} from "web3.storage";
import {useSnackbar} from "baseui/snackbar";

var CryptoJS = require("crypto-js");

function FetchTab() {
    const [loading, setLoading] = React.useState(false);
    const [pasteHash, setPasteHash] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [enablePassword, setEnablePassword] = React.useState(false);
    const [content, setContent] = React.useState("");
    const [language, setLanguage] = React.useState("");
    const [timestamp, setTimestamp] = React.useState("");

    const { enqueue } = useSnackbar();
    const storageClient = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_TOKEN })

    const fetchPaste = async () => {
        setLoading(true);
        const res = await storageClient.get(pasteHash);
        const files = await res.files()
        if (files.length > 1) {
            enqueue({
                message: 'File is not a paste',
                kind: "error",
            })
            return
        }
        const file = files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            let rawContent;
            try {
                const result = enablePassword ? CryptoJS.AES.decrypt(reader.result, password).toString(CryptoJS.enc.Utf8) : reader.result;
                rawContent = JSON.parse(result);
            } catch (e) {
                console.error(e);
                enqueue({
                    message: 'File is corrupted',
                    kind: "error",
                })
                setLoading(false);
                return;
            }
            setContent(rawContent.content);
            setLanguage(rawContent.language);
            setTimestamp(rawContent.timestamp);
            setLoading(false);
        });
        reader.readAsBinaryString(file);
    }

    return (
        <Block width="600px">
            <HeadingLevel>
                <ParagraphMedium><strong>Fetch Paste</strong></ParagraphMedium>
                <Input
                    value={pasteHash}
                    onChange={e => setPasteHash(e.currentTarget.value)}
                    placeholder="Paste Hash"
                    clearOnEscape
                    size={SIZE.compact}
                />
                <div style={{marginTop: 16, marginBottom: 16}}/>
                <Checkbox
                    checked={enablePassword}
                    onChange={e => setEnablePassword(e.currentTarget.checked)}
                    labelPlacement={LABEL_PLACEMENT.right}
                >
                    Password Protection
                </Checkbox>
                { enablePassword && (
                    <>
                        <div style={{marginTop: 16, marginBottom: 16}}/>
                        <Input
                            value={password}
                            onChange={e => setPassword(e.currentTarget.value)}
                            placeholder="Password"
                            clearOnEscape
                            size={SIZE.compact}
                        />
                    </>
                )}
                <div style={{marginTop: 16, marginBottom: 16}}/>
                <Button size="compact" isLoading={loading} onClick={fetchPaste}>
                    Fetch Paste
                </Button>
                <ParagraphMedium><strong>Content</strong></ParagraphMedium>
                {timestamp && (
                    <Tag kind={KIND.accent} closeable={false}>{new Date(timestamp).toLocaleDateString()}</Tag>
                )}
                <div style={{fontSize: 14}}>
                    <CopyBlock
                        text={content}
                        language={language}
                        showLineNumbers={true}
                        theme={solarizedDark}
                        codeBlock
                    />
                </div>

            </HeadingLevel>
        </Block>
    )
}

export default FetchTab;