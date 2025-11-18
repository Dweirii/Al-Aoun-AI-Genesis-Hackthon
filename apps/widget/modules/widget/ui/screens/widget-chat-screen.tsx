"use client";

import { AISuggestion, AISuggestions } from "@workspace/ui/components/ai/suggestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { contactSessionIdAtomFamily, conversationIdAtom, organizationIdAtom, screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Form, FormField } from "@workspace/ui/components/form";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
  AIInputImageButton,
  AIInputWithDragDrop,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { useMemo } from "react";
import { useImageUpload } from "@workspace/ui/hooks/use-image-upload";
import { parseMessageContent } from "@workspace/ui/lib/message-content";
import { ImageDisplay } from "@workspace/ui/components/ai/image-display";
import { Id } from "@workspace/backend/_generated/dataModel";

const formSchema = z.object({
  message: z.string(),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const suggestions = useMemo(() => {
    if (!widgetSettings) {
      return [];
    }

    return Object.keys(widgetSettings.defaultSuggestions).map((key) => {
      return widgetSettings.defaultSuggestions[
        key as keyof typeof widgetSettings.defaultSuggestions
      ];
    });
  }, [widgetSettings]);

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        } 
      : "skip"
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 10 },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
    status: messages.status,
    loadMore: messages.loadMore,
    loadSize: 10,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { selectedImages, addImages, removeImage, clearImages, canAddMore, previewUrls } = useImageUpload();
  const generateUploadUrl = useAction(api.public.files.generateUploadUrl);
  const uploadImage = useAction(api.public.files.uploadImage);
  const createMessage = useAction(api.public.messages.create);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }

    // Validate that we have either text or images
    if (!values.message.trim() && selectedImages.length === 0) {
      return;
    }

    try {
      // Upload images first
      const imageStorageIds: Id<"_storage">[] = [];
      
      if (selectedImages.length > 0) {
        for (const image of selectedImages) {
          const uploadUrl = await generateUploadUrl();
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": image.type },
            body: image,
          });
          const { storageId } = await response.json();
          
          // Validate the uploaded image
          const uploadResult = await uploadImage({ storageId });
          imageStorageIds.push(uploadResult.storageId);
        }
      }

      await createMessage({
        threadId: conversation.threadId,
        prompt: values.message.trim() || "",
        contactSessionId,
        imageStorageIds: imageStorageIds.length > 0 ? imageStorageIds : undefined,
      });

      form.reset();
      clearImages();
    } catch (error) {
      console.error("Failed to send message:", error);
      // Error handling - could show toast notification here
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Button
              onClick={onBack}
              size="icon"
              variant="ghost"
            >
              <ArrowLeftIcon />
            </Button>
            <p className="font-semibold">Chat</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
          >
            <MenuIcon />
          </Button>
        </div>
      </WidgetHeader>
      <AIConversation>
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((uiMessage, index) => {
            // Pair UI messages with raw messages to preserve multimodal content
            const rawMessage = messages.results?.[index];
            const messageContent =
              rawMessage?.message?.content ??
              // Fallback for legacy message shape
              (rawMessage?.message as string | undefined) ??
              uiMessage.content;
            const parsedContent = parseMessageContent(messageContent);

            return (
              <AIMessage
                from={uiMessage.role === "user" ? "user" : "assistant"}
                key={uiMessage.id}
              >
                <AIMessageContent>
                  {parsedContent.images.length > 0 && (
                    <ImageDisplay imageUrls={parsedContent.images} className="mb-2" />
                  )}
                  {parsedContent.text && (
                    <AIResponse>{parsedContent.text}</AIResponse>
                  )}
                </AIMessageContent>
                {uiMessage.role === "assistant" && (
                  <DicebearAvatar
                    imageUrl="/logo.png"
                    seed="assistant"
                    size={32}
                  />
                )}
              </AIMessage>
            )
          })}
        </AIConversationContent>
      </AIConversation>
      {toUIMessages(messages.results ?? [])?.length === 1 && (
        <AISuggestions className="flex w-full flex-col items-end p-2">
          {suggestions.map((suggestion) => {
            if (!suggestion) {
              return null;
            }

            return (
              <AISuggestion
                key={suggestion}
                onClick={() => {
                  form.setValue("message", suggestion, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  form.handleSubmit(onSubmit)();
                }}
                suggestion={suggestion}
              />
            )
          })}
        </AISuggestions>
      )}
      <Form {...form}>
          <AIInputWithDragDrop
            className="rounded-none border-x-0 border-b-0"
            onSubmit={form.handleSubmit(onSubmit)}
            onImageDrop={addImages}
            dragDropEnabled={canAddMore}
          >
            {/* Show selected images preview */}
            {selectedImages.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 border-b">
                {selectedImages.map((image, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={previewUrls[idx]}
                      alt={`Preview ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  disabled={conversation?.status === "resolved"}
                  onChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "This conversation has been resolved."
                      : "Type your message..."
                  }
                  value={field.value}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputImageButton
                  onImageSelect={addImages}
                  disabled={!canAddMore || conversation?.status === "resolved"}
                />
              </AIInputTools>
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" || 
                  (!form.formState.isValid && selectedImages.length === 0)
                }
                status="ready"
                type="submit"
              />
            </AIInputToolbar>
          </AIInputWithDragDrop>
      </Form>
    </>
  );
};
