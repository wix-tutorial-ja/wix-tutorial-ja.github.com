---
layout: default
title: WiX チュートリアル 日本語訳 - Lesson 3 - イベントとアクション / 1. 列に並んで
current: ch03-01
prev: index
prev-title: Lesson 3 - イベントとアクション
next: 02-extra-actions
next-title: 2. 追加のアクション
origin: /user-interface/events-and-actions/queueing-up/
---
# Lesson 3 - イベントとアクション

## 1. 列に並んで

Windows Installer は、インストールの間に、数多くのステップ、いわゆるアクションを実行します。
基本的なアクションも、特定のインストーラによって要求される追加のアクションも、自動的にスケジュールされます
(どんなアクションが追加されるかは、レジストリ・サーチやユーザー・インタフェイスなど、使用する機能によって左右されます)。
言い換えると、アクションの順序は、ツールセットによって、インストーラ・データベースが作成される時に、前もって決められます。
普通の .msi ファイルの場合は以下のようになります。

1. AppSearch
2. LaunchConditions
3. ValidateProductID
4. CostInitialize
5. FileCost
6. CostFinalize
7. InstallValidate
8. InstallInitialize
9. ProcessComponents
10. UnpublishFeatures
11. RemoveShortcuts
12. RemoveFiles
13. InstallFiles
14. CreateShortcuts
15. RegisterUser
16. RegisterProduct
17. PublishFeatures
18. PublishProduct
19. InstallFinalize
20. RemoveExistingProducts

インストーラの実際のアクションの順序は、[Windows Installer SDK](http://support.microsoft.com/kb/255905)
に入っている Orca という MSI エディタを使って確認することが出来ます。

![Orca screenshot](/images/orca.png)

これらのイベントの順序を変更することは、適切なタグを使うことで可能になります。実際、そういうタグが四つもあります。

- AdminUISequence
- InstallUISequence
- AdminExecuteSequence
- InstallExecuteSequence

**Admin-** で始まるものは、(`msiexec /a` で起動される)管理インストールです。
管理インストールは、アプリケーションのソース・イメージをネットワーク上に作成して、
後でワークグループのユーザーが元のメディアの代りにこのソース・イメージからインストール出来るようにします。
この機能は無料で付いてきます。
今までこの機能について思い悩んだ覚えはありませんが、私たちが作ったサンプルは全てこの方法でインストールすることが出来ます(試してみて下さい!)。

と言うわけで、差し当って残されているのは二つのタグだけです。
**InstallExecuteSequence** は、アクションを決定するために、常にインストーラによって参照されます。
一方、**InstallUISequence** は、インストーラが完全 UI モードか、簡易 UI モードで走るときだけ考慮に入れられます
(この機能も実験できます。`msiexec /qn`, `/qb` および `/qr` を試してみて下さい)。
どんな UI のモードの場合でも、レジストリ・サーチを起動条件の前に予定しておく必要がありますので、
そのことを示す行を二つのタグの両方に挿入します。
コンパイルして、レジストリ・キーの名前を変更しながら、走らせてみて下さい。期待通りに動くはずです。

> 訳註：/qn, /qb, /qr, /qf は msiexec の表示オプションで、ユーザー・インタフェイスのレベルを設定します。
> レベルの低い方から、/qn = UI 無し, /qb = 基本 UI, /qr = 簡易 UI, /qf = 完全 UI となります。省略時は完全 UI モードです。

上の Orca のスクリーンショットで、アクションの順序を示す番号を見ることが出来ます。
この番号を使うことも出来ますが、番号で頭を悩ますよりも、WiX にアクションの相対的な順序を指示する方がもっと簡単です。
単に、そのアクションが、どのアクションの **Before** または **After** に来るかを指定すれば良いのです。
アクションを実行のチェーンから削除したい場合は、**Suppress = yes** 属性を使って下さい。

    <InstallExecuteSequence>
      <LaunchConditions After='AppSearch' />
      <RemoveExistingProducts After='InstallFinalize' />
    </InstallExecuteSequence>