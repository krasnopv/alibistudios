declare module '@sanity/block-content-to-react' {
  interface BlockContentProps {
    blocks: unknown[];
    serializers?: Record<string, unknown>;
  }
  
  const BlockContent: React.FC<BlockContentProps>;
  export default BlockContent;
}
