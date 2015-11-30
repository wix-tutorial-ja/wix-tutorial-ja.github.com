---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 8 ユーザー・インタフェイス再び / 4. カスタマイズがいっぱい
chapter: ch08
current: ch08-04
prev: 03-interactions
prev-title: 3. 相互作用
next: 05-is-this-progress
next-title: 5. これが進捗ですか
origin: /user-interface-revisited/customizations-galore/
---
# Lesson 8 ユーザー・インタフェイス再び

## 4. カスタマイズがいっぱい

さて、今度は、もっと野心的なことをやりましょう。
ユーザーにセットアップのカスタマイズを許して、どの機能をインストールするかを決定したり、
ファイルをインストールする場所をインストーラに指示したり出来るようにします。

![CustomizeDlg](/images/customfeatures.png)

まず最初に、サンプルの複雑さを緩和するために、
全てのテキスト項目を UI_Texts.wxs という独立したフラグメント・ファイルに送り込んでしまいます。
実際のテキストは WiX のソースから取ってきたもので、私たちの UI 実験で最終的に必要になるかもしれない項目を全部記載したものです。
これを参照として呼び出すだけにします。
ビルド・プロセスは以下のようになります。

> 訳註：サンプルの日本語版([Sample-8-1-CustomUI.zip](/samples/Sample-8-1-CustomUI.zip))では、
> UI_Texts.wxs は目立つところしか日本語に翻訳していません。UI_Texts.wxs は、内容としては、WixUI_ja-jp.wxl と同じものです。

{% highlight bat %}
candle.exe SampleCustomUI4.wxs UI_Texts.wxs
light.exe -out SampleCustomUI4.msi SampleCustomUI4.wixobj 
    UI_Texts.wixobj
{% endhighlight %}

必要なコントロールを提供する新しいダイアログを作りましょう — まず最初に、機能のツリー・ビューです。
これは非常に簡単です。と言うのは、**SelectionTree** タイプのコントロールは単なるツリー・ビュー・コントロールではなくて、
インストーラによって有効な機能とその選択状態にリンクされるものだからです。

{% highlight xml %}
<Dialog Id="CustomizeDlg" Width="370" Height="270"
    Title="[ProductName] [Setup]" NoMinimize="yes"
    TrackDiskSpace="yes">
  <Control Id="Tree" Type="SelectionTree"
      X="25" Y="85" Width="175" Height="95"
      Property="_BrowseProperty" Sunken="yes" TabSkip="no"
      Text="選択ツリー" />
{% endhighlight %}

ダイアログはいくつかのプッシュ・ボタンを持ちます。
**Browse** ボタンは、**Feature** タグで **ConfigurableDirectory** 属性を使っていると、インストーラによって自動的に有効化されます。
選択ツリーとの関係で使用されるコントロール・イベントがいくつかあります。
**SelectionBrowse** イベントは、ユーザーがインストール先のパスを修正出来るように、指定された参照ダイアログを開きます。
この参照ダイアログについては、すぐ後で述べます。

{% highlight xml %}
  <Control Id="Browse" Type="PushButton"
      X="304" Y="200" Width="56" Height="17"
      Text="[ButtonText_Browse]">
    <Publish Event="SelectionBrowse" Value="BrowseDlg">1</Publish>
  </Control>
{% endhighlight %}

**Reset** ボタンは、**Reset** という作成済みのイベントを使用します。
このイベントは、ダイアログの全てのコントロールを作成時の状態に戻します。
つまり、ユーザーによって為された機能のカスタマイズをすべてアンドゥーします。

このボタンはイベント・メッセージを送信するだけでなく、イベントを **予約** (subscribe, 予約購読) する
ことによって、同様なメッセージの受信者にもなっています。
**SelectionNoItems** イベントは、選択ツリーがノードを持っていないときに、このイベントを予約しているボタンを無効化します。

{% highlight xml %}
  <Control Id="Reset" Type="PushButton"
      X="42" Y="243" Width="56" Height="17"
      Text="[ButtonText_Reset]">
    <Publish Event="Reset" Value="0">1</Publish>
    <Subscribe Event="SelectionNoItems" Attribute="Enabled" />
  </Control>
{% endhighlight %}

このダイアログには、既に私たちがよく知っているボタンや単純なコントロールが他にもあります。
ここではもう詳しく説明することはしませんので、ソース・ファイルを参照して下さい。
しかし、ダイアログの右側にあるボックスについては、詳しく見ていきます。
**Text** コントロールが、ユーザーが選択ツリーで現在選んでいる項目についての情報を表示するのに使われます。
このコントロールは初期値のテキスト ("現在選ばれている項目の複数行の説明。") を持っていますが、このテキストは表示されず、
実際に選択されている項目の情報によって置き換えられます。
この事は、このコントロールが **SelectionDescription** イベントを予約していることによって生じます。
選択状態に変化があるや否や、インストーラは、このイベントを予約している全てのコントロールに対して、選択された項目の説明を知らます。

{% highlight xml %}
  <Control Id="Box" Type="GroupBox"
      X="210" Y="81" Width="140" Height="98" />

  <Control Id="ItemDescription" Type="Text"
      X="215" Y="90" Width="131" Height="30">
    <Text>現在選ばれている項目の複数行の説明。</Text>
    <Subscribe Event="SelectionDescription" Attribute="Text" />
  </Control>
{% endhighlight %}

同じ事が他のコントロールにも発生します。
**ItemSize** は現在選択されている項目のサイズを受け取ることを予約していますし、
**Location** はユーザーによって選択されたパスを教えてもらうように予約しています。
**Location** と **LocationLabel** は、設定すべきパスがあるかどうか、ということもチェックしています。
設定すべきパスが無い場合は、ラベルもパスも表示を抑止されます。
選択ツリーでメインのノードからサブ・ノードへ移動するとパスの選択の表示が消えるのは、このことによっています。

{% highlight xml %}
  <Control Id="ItemSize" Type="Text"
      X="215" Y="130" Width="131" Height="45">
    <Text>現在選ばれている項目のサイズ。</Text>
    <Subscribe Event="SelectionSize" Attribute="Text" />
  </Control>

  <Control Id="Location" Type="Text"
      X="75" Y="200" Width="215" Height="20">
    <Text>現在選ばれている項目のパス</Text>
    <Subscribe Event="SelectionPath" Attribute="Text" />
    <Subscribe Event="SelectionPathOn" Attribute="Visible" />
  </Control>

  <Control Id="LocationLabel" Type="Text"
      X="25" Y="200" Width="50" Height="10"
      Text="場所:">
    <Subscribe Event="SelectionPathOn" Attribute="Visible" />
  </Control>
</Dialog>
{% endhighlight %}

私たちはユーザーが **Browse** ボタンをクリックしたときに **BrowseDlg** ダイアログを呼ぶべきことをインストーラに指示しましたので、
このダイアログも提供しなければなりません。

![BrowseDlg](/images/custombrowse.png)

前に戻って、以前の **Dialog** タグを調べると、**Property** への参照があることに気付くでしょう。
ここでも、パス・エディット・コントロールでプロパティへの参照を定義します — 
このプロパティへの参照が、パスを要求する親ダイアログと、パスを提供するこのダイアログの間のリンクを作成します。
**Indirect** をセットして、パスの受け渡しに使用するプロパティが直接に言及されているプロパティ (**_BrowseProperty**) ではなく、
このプロパティが指し示す別のプロパティであることを、インストーラに対して指示しています。

{% highlight xml %}
<Dialog Id="BrowseDlg" Width="370" Height="270"
    Title="[ProductName] [Setup]" NoMinimize="yes">
  <Control Id="PathEdit" Type="PathEdit"
      X="84" Y="202" Width="261" Height="18"
      Property="_BrowseProperty" Indirect="yes" />
{% endhighlight %}

>  訳註：**Indirect="yes"** の場合、コントロールが表示および更新すべきパスは、指定されているプロパティそのものが保持するのではなく、
> そのプロパティによって間接参照されているプロパティが保持することになります。
> どのプロパティが間接参照されることになるかは、動的に変化します。
>
> このサンプルの場合は、親ダイアログから **SelectionBrowse** イベントによって **BrowseDlg** ダイアログを呼び出す際に、
> 親ダイアログの **SelectionTree** に関連づけられたプロパティ (**_BrowseProperty**) に、
> 変更対象のパスを保持するプロパティ (例えば *INSTALLDIR*) がセットされます。
> パスを保持するプロパティは、**SelectionTree** の選択状態に応じて、違うものになり得ます。
> サンプルでは、変更可能なパスは一つしかありませんが、いつもそうだとは限りません。
>
> すなわち、パスを保持するプロパティを間接参照するのは、**SelectionBrowse** イベントの仕様がそのようにすることを要求するからです。
> なお、**SelectionBrowse** イベントは **Browse** ボタンによって発行されますが、
> 実際には、**SelectionTree** に属するイベントであると言って良いものです。

ユーザーが新しく選んだパスに満足して OK を押すと、**SetTargetPath** イベントによってプロパティの値が設定されます。
インストーラは選択されたパスの妥当性もチェックします。
ユーザーが結局パスを設定しないことに決めた場合は、**Reset** イベントを使って全てを初期設定の状態に戻し、
ダイアログがパスを実際には設定しないようにします。

{% highlight xml %}
  <Control Id="OK" Type="PushButton"
      X="304" Y="243" Width="56" Height="17" Default="yes"
      Text="[ButtonText_OK]">
    <Publish Event="SetTargetPath"
        Value="[_BrowseProperty]">1</Publish>
    <Publish Event="EndDialog" Value="Return">1</Publish>
  </Control>

  <Control Id="Cancel" Type="PushButton"
      X="240" Y="243" Width="56" Height="17" Cancel="yes"
      Text="[ButtonText_Cancel]">
    <Publish Event="Reset" Value="0">1</Publish>
    <Publish Event="EndDialog" Value="Return">1</Publish>
  </Control>
{% endhighlight %}

> 訳註：ここでも、**SetTargetPath** イベントに対する引数として、プロパティが間接参照で渡されています。

**DirectoryCombo** コントロールは、参照するプロパティに保存されているパスを、階層構造を持ったツリーのビューで表示します。

{% highlight xml %}
  <Control Id="ComboLabel" Type="Text"
      X="25" Y="58" Width="44" Height="10" TabSkip="no"
      Text="場所(&L)" />

  <Control Id="DirectoryCombo" Type="DirectoryCombo"
      X="70" Y="55" Width="220" Height="80"
      Property="_BrowseProperty" Indirect="yes" Fixed="yes" 
      Remote="yes">
    <Subscribe Event="IgnoreChange" Attribute="IgnoreChange" />
  </Control>
{% endhighlight %}

アイコンを持った二つのボタンは、ディレクトリ選択コントロールと関連づけられて、押された時に適切なイベントを発行します。

{% highlight xml %}
  <Control Id="Up" Type="PushButton"
      X="298" Y="55" Width="19" Height="19"
      ToolTip="一つ上のフォルダへ"
      Icon="yes" FixedSize="yes" IconSize="16" Text="Up">
    <Publish Event="DirectoryListUp" Value="0">1</Publish>
  </Control>

  <Control Id="NewFolder" Type="PushButton"
      X="325" Y="55" Width="19" Height="19"
      ToolTip="新しいフォルダを作成する"
      Icon="yes" FixedSize="yes" IconSize="16" Text="New">
    <Publish Event="DirectoryListNew" Value="0">1</Publish>
  </Control>
{% endhighlight %}

そして最後に、真ん中に大きな **DirectoryList** を置きます。
このコントロールは、同じプロパティを参照しているという事実によって、他のディレクトリを制御する要素とリンクされています。
これらすべてのコントロールが自動的に期待している通りの相互作用をします。

{% highlight xml %}
  <Control Id="DirectoryList" Type="DirectoryList"
       X="25" Y="83" Width="320" Height="110"
       Property="_BrowseProperty" Sunken="yes" Indirect="yes"
       TabSkip="no" />
{% endhighlight %}

ダイアログの残りの要素は、もはや特別に興味深いものではありませんので、必要に応じてソースを参照して下さい。

SampleCustomUI4 をビルド出来るようにするために残っている仕事は二～三の小さな修正だけです。
**InstallDlg** ダイアログに **Back** ボタンを追加して、ユーザーがカスタマイズ・ダイアログに戻ることが出来るように修正します。

{% highlight xml %}
<Control Id="Back" Type="PushButton"
    X="180" Y="243" Width="56" Height="17"
    Text="[ButtonText_Back]">
  <Publish Event="NewDialog" Value="CustomizeDlg">1</Publish>
</Control>
{% endhighlight %}

**CustomizeDlg** ダイアログのスケジューリングを変更して、カスタマイズを実行すべき段階でそれを表示するようにしなければなりません。
それにはいくつかの選択肢がありますが、ここでは **MigrateFeatureStates** イベントの後にスケジュールします。
このイベントはアップグレードとインストールの場合にだけ発生し、製品の削除またはメンテナンスの際には発生しません。
このイベントが既にインストールされている製品 (もし有れば) の機能の選択状態を読み込みます。
従って、適切な機能の選択状態をもってカスタマイズ・ダイアログを表示するためには、
現在のサンプルよりももっと複雑なインストーラ・パッケージの場合でも、この位置が最適の選択肢です。

{% highlight xml %}
<InstallUISequence>
  <Show Dialog="CustomizeDlg" 
      After="MigrateFeatureStates">NOT Installed</Show>
</InstallUISequence>
{% endhighlight %}

そして最後に、ブラウズ・ダイアログで必要になる二つの新しいアイコンを忘れずに入れておきます。

{% highlight xml %}
<Binary Id="Up" SourceFile="Binary\Up.ico" />
<Binary Id="New" SourceFile="Binary\New.ico" />
{% endhighlight %}

### カスタマイズをカスタマイズする

インストールされる機能を自動的に選択したり、別の条件によって選択したりする必要がある場合、もしくは、
ユーザーが機能を選択するための全く新しいインタフェイス 
(例えば、**SelectionTree** の代りにチェックボックスを使うなど)
を作成したい場合は、下記のイベントを適切なコントロール
(例えば **Next** ボタン) にリンクさせて、所定の機能のインストールを有効化または無効化することが出来ます。

{% highlight xml %}
<Publish Event="AddLocal" Value="FeatureId">...condition...</Publish>
<Publish Event="Remove" Value="FeatureId">...condition...</Publish>
{% endhighlight %}
