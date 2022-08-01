import * as React from "react";
import { Block } from 'baseui/block';
import { HeadingLevel } from 'baseui/heading'
import { Textarea } from "baseui/textarea";
import {Input, SIZE} from "baseui/input";
import {ParagraphMedium} from "baseui/typography";
import {Button} from "baseui/button";
import {
    Checkbox,
    LABEL_PLACEMENT,
} from "baseui/checkbox";
import { Combobox } from "baseui/combobox";
import { Web3Storage } from 'web3.storage'
import {Card, StyledBody} from 'baseui/card';
import { FileUploader } from "baseui/file-uploader";
import {Table} from 'baseui/table-semantic';

const CryptoJS = require("crypto-js");

function CreateTab() {
    const [loading, setLoading] = React.useState(false);
    const [isUpload, setIsUpload] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadFiles, setUploadFiles] = React.useState([]);
    const [textContent, setTextContent] = React.useState("");
    const [language, setLanguage] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [enablePassword, setEnablePassword] = React.useState(false);

    const [cid, setCid] = React.useState("");

    const storageClient = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_TOKEN })

    const reset = () => {
        setIsUploading(false);
    }

    const handleUpload = (acceptedFiles, rejectedFiles) => {
        setIsUploading(true);
        setUploadFiles(acceptedFiles);
        setIsUploading(false);
    }

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

        let formattedContent, serializedFiles;

        if (isUpload) {
            serializedFiles = [];
            const filePromises = uploadFiles.map((file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = async () => {
                        try {
                            const response = {
                                content: Array.from(new Uint8Array(reader.result)),
                                type: file.type,
                                name: file.name,
                            };
                            resolve(response);
                        } catch (err) {
                            reject(err);
                        }
                    };
                    reader.onerror = (error) => {
                        reject(error);
                    };
                    reader.readAsArrayBuffer(file);
                });
            });
            serializedFiles = await Promise.all(filePromises);
        } else {
            serializedFiles = [{
                content: textContent,
                type: null,
                name: null,
            }];
        }

        formattedContent = {
            isFile: isUpload,
            files: serializedFiles,
            language: language === "none" ? "" : language,
            timestamp: new Date().getTime(),
        }
        const serializedFileContent = JSON.stringify(formattedContent);
        const finalizedFileContent = enablePassword ? CryptoJS.AES.encrypt(serializedFileContent, password).toString() : serializedFileContent;
        const file = new File([finalizedFileContent], await sha256(finalizedFileContent), { type: 'text/plain' });
        const cid = await storageClient.put([file]);

        setCid(cid);
        setLoading(false);
    }

    const filteredOptions = React.useMemo(() => {
        const supportedLanguages = [
            "none", "abap", "actionscript", "ada", "arduino", "autoit", "c", "clojure", "cs", "c", "cpp", "coffeescript", "csharp", "css", "cuda", "d", "dart", "delphi", "elixir", "elm", "erlang", "fortran", "foxpro", "fsharp", "go", "graphql", "gql", "groovy", "haskell", "haxe", "html", "java", "javascript", "json", "julia", "jsx", "js", "kotlin", "latex", "lisp", "livescript", "lua", "mathematica", "makefile", "matlab", "objectivec", "objective", "objective", "objectpascal", "ocaml", "octave", "perl", "php", "powershell", "prolog", "puppet", "python", "qml", "r", "racket", "restructuredtext", "rest", "ruby", "rust", "sass", "less", "scala", "scheme", "shell", "smalltalk", "sql", "standardml", "sml", "swift", "tcl", "tex", "text", "tsx", "ts", "typescript", "vala", "vbnet", "verilog", "vhdl", "xml", "xquery", "yaml"
        ]
        return supportedLanguages.filter(option => {
            return option
                .toLowerCase()
                .includes(language.toLowerCase());
        });
    }, [language]);

    const getFormattedUploadedFileInfo = () => {
        const data = []
        for (const uploadFile of uploadFiles) {
            data.push([
                uploadFile.name,
                uploadFile.type,
                uploadFile.size,
            ])
        }
        return data;
    }

    return (
        <Block width="100%">
            <HeadingLevel>
                <ParagraphMedium><strong>Create New Paste</strong></ParagraphMedium>
                <Checkbox
                    checked={isUpload}
                    onChange={e => {
                        setLanguage("none");
                        setIsUpload(e.target.checked)
                    }}
                    labelPlacement={LABEL_PLACEMENT.right}
                >
                    Upload a file
                </Checkbox>
                <div style={{marginTop: 16, marginBottom: 16}}/>
                {
                    isUpload && (
                        <div>
                            <FileUploader
                                onCancel={reset}
                                onDrop={handleUpload}
                                progressMessage={
                                    isUploading ? `Uploading...` : ''
                                }
                            />
                            <div style={{marginTop: 16, marginBottom: 16}}/>
                            <Card>
                                <ParagraphMedium>Uploaded Files</ParagraphMedium>
                                <Table
                                    overrides={{
                                        Root: {
                                            style: {
                                                maxHeight: '300px',
                                            },
                                        },
                                    }}
                                    columns={[
                                        'Name',
                                        'Type',
                                        'Size',
                                    ]}
                                    data={getFormattedUploadedFileInfo()}
                                />
                            </Card>
                        </div>
                    )
                }
                {
                    !isUpload && (
                        <Textarea
                            value={textContent}
                            onChange={e => setTextContent(e.currentTarget.value)}
                            size={SIZE.compact}
                            placeholder="Input anything..."
                            clearable
                            clearOnEscape
                            autoFocus
                            overrides={{
                                Input: {
                                    style: {
                                        minHeight: '300px',
                                        width: '100vw',
                                        resize: 'vertical',
                                    },
                                },
                                InputContainer: {
                                    style: {
                                        maxWidth: '100%',
                                        height: 'min-content',
                                    },
                                },
                            }}
                        />
                    )
                }
                <div style={{marginTop: 16, marginBottom: 16}}/>
                <div style={{marginTop: 16, marginBottom: 16}}/>
                <ParagraphMedium><strong>Options</strong></ParagraphMedium>
                { !isUpload && (
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
                )}
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