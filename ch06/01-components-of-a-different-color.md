---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 6 COM、式の構文、その他 / 1. 違う色のコンポーネント
current: ch06-01
prev: /ch05/05-services-rendered
prev-title: 5. サービスの提供
next: 02-expression-syntax
next-title: 2. 式の構文
origin: /com-expression-syntax-miscellanea/components-of-a-different-color/
---
#  Lesson 6 COM、式の構文、その他

## 1. 違う色のコンポーネント

WiX に含まれている *Heat* は、様々なソース (フォルダ、ファイル、パフォーマンス・カウンター、ウェブ・サイト)
からデータを収集するのに使うツールです。
項目数があまりに多くて、対応する WiX のソース・ファイルを手作業で書くことが出来ないという場合に役立ちます。
このツールは、主として、一度だけ走らせてデータを収集し、後は通常の方法でソース・ファイルを保守する、という使い方を意図しています。
ビルド環境に組み込んで、入力データ・セットに変更があるたびに何度も繰り返して走らせる、というものではありません。
それでもなお、この第二の方法で使いたいという場合は、入力データ・セットの変更が望ましくない副作用
(たいていは、コンポーネントの規則に対する違反) を惹起しないように、十分に注意を払う必要があります。
なるほど、そういう目的の達成を支援する機能が Heat にあるのは本当ですが、そういう機能を使う時は注意が必要です。

Heat の第一のモードは、ファイルがいっぱい入った一つまたは複数のフォルダを調べて、必要な WiX ソースを作成するのを支援するものです。

    heat dir folder -cg SampleGroup -out SampleGroup.wxs

上記のコマンドは、指定されたフォルダを再帰的に調べて、`-cg` スイッチで指定された名前の **ComponentGroup** を持つ
**Fragment** を作成します。
コンポーネント・グループには、見付かったファイルの数だけのコンポーネントが入り、各コンポーネントには、
規則に従って、ファイルが一つずつ入ります。
そして、コンポーネント、ディレクトリ、ファイルの全てに対して、一意になるように生成された識別子が割り当てられます。
これらの識別子は、同じ入力セットで再生成される場合は、同じままで変化しません。
GUID は、`-gg` スイッチによって明示的に生成するように指示しない限り、生成されません (プレースホルダのテキストだけが作られます) 。

Heat は、コンポーネント・グループだけでなく、再帰的に訪れたフォルダの一つずつに対して、
ディレクトリの参照 (**DirectoryRef** タグ) を含んだフラグメントも同時に生成します。
調べる対象になったルート・ディレクトリは、特に名前を指定しない限り、**TARGETDIR** という識別子を与えられます。

    heat dir path -dr MyDirName -cg SampleGroup -out SampleGroup.wxs

自動的に生成される識別子がこの名前をシードとして使うことに注意して下さい。
この名前を変更すると、すべての識別子が変ります。
不適切な時に変更すると、コンポーネントの規則に違反する悲惨な結果になる可能性があります。

もう一つ別のスイッチ、`-srd` を使うと、指定されたルート・フォルダに対して、識別子の生成が抑制されます。
ルート・フォルダに属するファイルは、その **Directory** を **TARGETDIR** または `-dr` スイッチで指定された名前で参照します。
そして、ルート・フォルダに対する独立した **DirectoryRef** フラグメントは生成されません。

    heat dir path -srd -dr MyDirName -cg SampleGroup -out SampleGroup.wxs

このツールの第二のモードは、単一のファイルを扱います。
そのファイルに関連するレジストリ、あるいは、COM やそれに類する項目がある場合に、それらの全部が Heat によって抽出されるのです
(ここでの主題は Shell32.dll システム・ライブラリのための相互運用アセンブリです)。

    heat file file -cg SampleGroup -out SampleGroup.wxs

上記のコマンドの結果、全ての詳細が正しく抽出されて、下記と同様なソース・ファイルが作られます。

    <?xml version="1.0" encoding="utf-8"?>
    <Wix xmlns="http://schemas.microsoft.com/wix/2006/wi">
      <Fragment>
        <ComponentGroup Id="SampleGroup">
          <Component Id="cmpA8B0842041500B0ACE61F7EFD0FBD893"
              Directory="dir0F6F75DF46D1BACE2233EC573E6D4AA9"
              Guid="PUT-GUID-HERE">
            <File Id="filDDAAB2C11E1E5AE4668D99216C3B5523" KeyPath="yes"
                Source="SourceDir\SampleHeat\Interop.Shell32.dll" />
            <RegistryValue Root="HKCR"
                Key="CLSID\{0A89A860-D7B1-11CE-8350-444553540000}\InprocServer32\1.0.0.0"
                Name="Class"
                Value="Shell32.ShellDispatchInprocClass"
                Type="string" Action="write" />
            <RegistryValue Root="HKCR"
                Key="CLSID\{0A89A860-D7B1-11CE-8350-444553540000}\InprocServer32\1.0.0.0"
                Name="Assembly"
                Value="Interop.Shell32, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"
                Type="string" Action="write" />
            <RegistryValue Root="HKCR"
                Key="CLSID\{0A89A860-D7B1-11CE-8350-444553540000}\InprocServer32\1.0.0.0"
                Name="RuntimeVersion"
                Value="v2.0.50727"
                Type="string" Action="write" />
            <RegistryValue Root="HKCR"
                Key="CLSID\{0A89A860-D7B1-11CE-8350-444553540000}\InprocServer32\1.0.0.0"
                Name="CodeBase"
                Value="file:///[#filDDAAB2C11E1E5AE4668D99216C3B5523]"
                Type="string" Action="write" />
            <RegistryValue Root="HKCR"
                Key="CLSID\{0A89A860-D7B1-11CE-8350-444553540000}\InprocServer32"
                Name="Class"
                Value="Shell32.ShellDispatchInprocClass"
                Type="string" Action="write" />
            <RegistryValue Root="HKCR"
                Key="CLSID\{0A89A860-D7B1-11CE-8350-444553540000}\InprocServer32"
                Name="Assembly"
                Value="Interop.Shell32, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"
                Type="string" Action="write" />
            <RegistryValue Root="HKCR"
                Key="CLSID\{0A89A860-D7B1-11CE-8350-444553540000}\InprocServer32"
                Name="RuntimeVersion"
                Value="v2.0.50727"
                Type="string" Action="write" />
            <RegistryValue Root="HKCR"
                Key="CLSID\{0A89A860-D7B1-11CE-8350-444553540000}\InprocServer32"
                Name="CodeBase"
                Value="file:///[#filDDAAB2C11E1E5AE4668D99216C3B5523]"
                Type="string" Action="write" />
            ...
          </Component>
        </ComponentGroup>
      </Fragment>
      <Fragment>
        <DirectoryRef Id="TARGETDIR">
          <Directory Id="dir0F6F75DF46D1BACE2233EC573E6D4AA9" Name="SampleHeat" />
        </DirectoryRef>
      </Fragment>
      <Fragment>
        <DirectoryRef Id="dir0F6F75DF46D1BACE2233EC573E6D4AA9" />
      </Fragment>
    </Wix>

ここで、いくらか言葉を追加しなければなりません。
レジストリなどの変更を全てインストーラ・パッケージに書くべきか、それとも、
インストールされたコンポーネント (例えば DLL）が自分自身を登録する
(最初に起動される時にレジストリ・エントリを追加したり、その他のセットアップ作業を実行する) ようにすべきか、
という問題について悩む人がかなりいるようです。
答えは簡単です。**決して自己登録を使ってはいけません**。
Windows Installer は、製品のバージョンや更新を追跡記録したり、製品を完全かつ確実に削除したりすることが出来るように、
レジストリへの登録やファイルの変更をすべて追跡して記録することが出来なければなりません。
重要なデータをインストーラの管轄外に置くことは、このメカニズムを台無しにして、ユーザーに問題を与えるだけの事です。
自己登録は [Microsoft も使わないことを非常に強く推奨](https://msdn.microsoft.com/en-us/library/aa371608%28v=vs.85%29.aspx)
していますので、どんなことがあっても避けるべきです。

第三のモードは、Visual Studio のプロジェクト・ファイル (またはそれと互換性のあるファイル) を調べて、
指定されたタイプの全てのファイルに対する参照を作成します。
ファイルのタイプは、*Binaries*, *Symbols*, *Documents*, *Satellites*, *Sources* あるいは *Content* です。
例えば、Binaries を指定すると、プロジェクトによってビルドして配置される全てのバイナリ・ファイルが収集され、
全て対応するコンポーネントとディレクトリに入れられます。
その結果を最終的な WiX のソースに取り込むことは、簡単な参照を使うだけで出来ます。

    heat project projectfile -pog:Binaries -cg SampleGroup
         -out SampleGroup.wxs

これまでの例では、後で完全なセットアップ・パッケージに組み込むための断片を生成するために Heat を使いました。
しかし、私たちはこのツールに対して、フラグメントではなく モジュール または独立した 製品 を生成するように指示することも出来ます。
比較的小さなパッケージであれば、実際には Heat が WiX ソース・ファイルの大半を書いてくれて、いくつかの項目
GUID やテキストによる説明)だけを手作業で追加しなければならない、ということになるかも知れません。

    heat ... -template:module -cg SampleGroup -out SampleGroup.wxs
    heat ... -template:product -cg SampleGroup -out SampleGroup.wxs

タイプ・ライブラリは WiX で直接にサポートされています。
タイプ・ライブラリの全ての内部情報を収集するために、Heat やその他のツールを使う必要はありません。

    <File Id="file.dll" Name="file.dll" KeyPath="yes">
      <TypeLib Id="YOURGUID-0BFE-4B1A-9205-9AB900C7D0DA" Language="0" />
    </File>