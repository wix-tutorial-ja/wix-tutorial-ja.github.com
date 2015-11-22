---
layout: default
title: WiX チュートリアル 日本語訳 - Lesson 1 - 始めよう / 6. 条件付きインストール
current: ch01-06
prev: 05-where-to-install
prev-title: 5. どこにインストールするか?
next: 07-beyond-files
next-title: 7. ファイルだけでなく
origin: /getting-started/conditional-installation/
---
# Lesson 1 始めよう

## 6. 条件付きインストール

私たちは既に起動条件を取り上げました。
起動条件を使うと、指定された条件が偽である場合はインストール全体が中止されます。
条件の使い方にはもう少し洗練されたやりかたもあります。
プロセス全体を無効にせず、何をすべきかを決定するのに条件を使用するのです。
条件付きインストールを使うために、以前の単一の機能を二つに分割します — 
そうすれば、どちらをインストールするべきかを条件によって決定することが出来ます。

    <Feature Id='Complete' Level='1'>
      <Feature Id='MainProgram' Level='1'>
        <ComponentRef Id='MainExecutable' />
      </Feature>
    
      <Feature Id='Documentation' Level='1'>
        <ComponentRef Id='Manual' />
      </Feature>
    </Feature>

今このサンプルをそのままビルドしても、何も面白い事は起きません。
MainProgram 機能が EXE と DLL および関連するショートカットをインストールし、
Documentation 機能が残りの PDF と関連するショートカットをインストールします。
つまり、結局のところ、同じファイルがインストールされます。
しかし、今まで言及しなかった **Level** 属性に注目して下さい。
0 でない値は *インストールする* を意味し、0 の値は *インストールしない* を意味します。
そして、既に取り上げた Condition を使用して、親の機能(条件を直接包含している **Feature** タグ)のレベルをその場で変更することが出来ます。
以下の例では、条件が真と評価される場合に、Level が 1 になって、インストールが実行されます。

    <Feature Id='Documentation' Level='0'>
      <ComponentRef Id='Manual' />
      <Condition Level="1">FILEEXISTS</Condition>
    </Feature>

すなわち、PDF とそのショートカットは、レジストリ・エントリが示しているフォルダに `Lookfor.txt`
というファイルが見つかった場合ににみ、インストールが実行されます。
このことをあなたのコンピュータで確認するためには、[SampleCondition](https://www.firegiant.com/system/files/samples/SampleCondition.zip)
をダウンロードして下さい。

> 訳註：SampleCondition の日本語版は [Sample-1-6-Condition.zip](/samples/Sample-1-6-Condition.zip) です。
>
> ダウンロードされるサンプルでは、オリジナルも翻訳も、本文とは逆に、**条件が真になった場合にはインストールしない**
> という書き方をしています。
>
>     <Feature Id='Documentation' Level='1'>
>       <ComponentRef Id='Manual' />
>       <Condition Level="0">NOT FILEEXISTS</Condition>
>     </Feature>
>
> 実質的な動作は同じです。

既に見た全ての条件も同じように使うことが出来ます。
例えば、管理者でないユーザーに対して機能を無効化するためには、次のようにします。

    <Feature Id='Documentation' Level='0'>
      <ComponentRef Id='Manual' />
      <Condition Level="1">Privileged</Condition>
    </Feature>
