import * as React from "react";
import { Block } from 'baseui/block';
import { HeadingLevel } from 'baseui/heading'
import { Textarea } from "baseui/textarea";
import {Input, SIZE} from "baseui/input";
import {ParagraphMedium} from "baseui/typography";
import {Button} from "baseui/button";
import {
    Checkbox,
    LABEL_PLACEMENT
} from "baseui/checkbox";
import { Combobox } from "baseui/combobox";
import { Web3Storage } from 'web3.storage'
import {Card, StyledBody} from 'baseui/card';

const CryptoJS = require("crypto-js");

function CreateTab() {
    const [loading, setLoading] = React.useState(false);
    const [content, setContent] = React.useState("");
    const [language, setLanguage] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [enablePassword, setEnablePassword] = React.useState(false);

    const [cid, setCid] = React.useState("");

    const supportedLanguages = [
        "none", "abap", "actionscript", "ada", "arduino", "autoit", "c", "clojure", "cs", "c", "cpp", "coffeescript", "csharp", "css", "cuda", "d", "dart", "delphi", "elixir", "elm", "erlang", "fortran", "foxpro", "fsharp", "go", "graphql", "gql", "groovy", "haskell", "haxe", "html", "java", "javascript", "json", "julia", "jsx", "js", "kotlin", "latex", "lisp", "livescript", "lua", "mathematica", "makefile", "matlab", "objectivec", "objective", "objective", "objectpascal", "ocaml", "octave", "perl", "php", "powershell", "prolog", "puppet", "python", "qml", "r", "racket", "restructuredtext", "rest", "ruby", "rust", "sass", "less", "scala", "scheme", "shell", "smalltalk", "sql", "standardml", "sml", "swift", "tcl", "tex", "text", "tsx", "ts", "typescript", "vala", "vbnet", "verilog", "vhdl", "xml", "xquery", "yaml"
    ]
    const storageClient = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_TOKEN })


    const generateRandomPassword = () => {
        const password = Math.random().toString(36).substring(2, 15);
        setPassword(password);
    }

    const sha256 = async (str) => {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
        return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
    }

    const createNewPaste = async () => {
        setLoading(true);
        let fileContent;
        fileContent = {
            content: content,
            language: language === "none" ? "" : language,
            timestamp: new Date().getTime(),
        }
        const serializedFileContent = JSON.stringify(fileContent);
        const finalizedFileContent = enablePassword ? CryptoJS.AES.encrypt(serializedFileContent, password).toString() : serializedFileContent;
        const file = new File([finalizedFileContent], await sha256(finalizedFileContent), { type: 'text/plain' });
        const cid = await storageClient.put([file]);
        setCid(cid);
        setLoading(false);
    }

    const filteredOptions = React.useMemo(() => {
        return supportedLanguages.filter(option => {
            return option
                .toLowerCase()
                .includes(language.toLowerCase());
        });
    }, [supportedLanguages, language]);

    return (
        <Block width="600px">
            <HeadingLevel>
                <ParagraphMedium><strong>New Paste</strong></ParagraphMedium>
                <Textarea
                    value={content}
                    onChange={e => setContent(e.currentTarget.value)}
                    size={SIZE.compact}
                    placeholder="Input anything..."
                    clearable
                    clearOnEscape
                    autoFocus
                    overrides={{
                        Input: {
                            style: {
                                height: '500px',
                            },
                        },
                        InputContainer: {
                            style: {
                                height: 'min-content',
                            },
                        },
                    }}
                />
                <div style={{marginTop: 16, marginBottom: 16}}/>
                <div style={{marginTop: 16, marginBottom: 16}}/>
                <ParagraphMedium><strong>Options</strong></ParagraphMedium>
                <Combobox
                    value={language}
                    onChange={nextValue => setLanguage(nextValue)}
                    options={filteredOptions}
                    mapOptionToString={option => option}
                    size={SIZE.compact}
                    autocomplete={true}
                    overrides={{
                        Input: {
                            props: {
                                placeholder: 'Select the language',
                            },
                        },
                    }}
                />
                <div style={{marginTop: 16, marginBottom: 16}}/>
                <Checkbox
                    checked={enablePassword}
                    onChange={e => {
                        generateRandomPassword();
                        setEnablePassword(e.currentTarget.checked)
                    }}
                    labelPlacement={LABEL_PLACEMENT.right}
                >
                    Password Protection
                </Checkbox>
                <div style={{marginTop: 16, marginBottom: 16}}/>
                {enablePassword && (
                    <Input
                        value={password}
                        onChange={e => setPassword(e.currentTarget.value)}
                        placeholder="Password"
                        clearOnEscape
                        size={SIZE.compact}
                    />
                )}
                <div style={{marginTop: 16, marginBottom: 16}}/>
                <Button size="compact" isLoading={loading} onClick={createNewPaste}>
                   Create New Paste
                </Button>
                {cid && (
                    <>
                        <div style={{marginTop: 16, marginBottom: 16}}/>
                        <Card>
                            <StyledBody>
                                Create successfully! Remember the Paste Hash for sharing: <strong>{cid}</strong>
                            </StyledBody>
                        </Card>
                    </>
                )}
                <div style={{marginTop: 16, marginBottom: 16}}/>
            </HeadingLevel>
        </Block>
    )
}

export default CreateTab;