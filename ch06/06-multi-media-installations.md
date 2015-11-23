---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 6 COM、式の構文、その他 / 6. 複数メディアのインストーラ
current: ch06-06
prev: 05-creating-directories
prev-title: 5. ディレクトリの作成
next: 07-add-or-remove-programs-entries
next-title: 7. プログラムの追加と削除の項目
origin: /com-expression-syntax-miscellanea/multi-media-installations/
---
#  Lesson 6 COM、式の構文、その他

## 6. 複数メディアのインストーラ

複数メディアのインストール (例えば、一枚の CD にファイルが収まらない場合) については、既にレッスン 1 で言及しました。
その場合、個々の物理メディアを示すために、ソース・ファイルに複数の **Media** タグを記述することが必要になります。
これまでのインストーラとは違って、ファイル・アーカイブを .msi ファイルに埋め込むことは、もちろん出来ません。
また、ユーザーの便宜のために、人間が読むことが出来る (必要なら、地域化可能な) プロンプトを指定し、
さらに、ボリューム・ラベルを指定しなければなりません。
このボリューム・ラベルは、物理メディアの実際のボリューム・ラベルと一致しなければなりません。
インストーラはボリューム・ラベルを見て、要求されているメディアをユーザーが挿入したかどうかを判断します。

    <Media Id='1' Cabinet='Sample1.cab' EmbedCab='no'
        DiskPrompt="CD-ROM #1" VolumeLabel="HOGE_DISK1" />
    
    <Media Id='2' Cabinet='Sample2.cab' EmbedCab='no'
        DiskPrompt="CD-ROM #2" VolumeLabel="HOGE_DISK2" />

ユーザーに正しいメディアを挿入するように促す実際のメッセージを作るために、
Windows Installer は **DiskPrompt** プロパティをも必要とします。
これには、下記のように、書式指定文字列を使う必要があります。
**`[1]`** は対応する **Media** タグの **DiskPrompt** 属性の内容で置き換えられます。

    <Property Id='DiskPrompt' Value="ぴよソフトのほげ 1.0 インストーラ [1]" />